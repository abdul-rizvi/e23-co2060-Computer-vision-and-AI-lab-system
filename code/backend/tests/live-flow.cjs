// Explicit opt-in integration audit. Every data write is rolled back; emails are stubbed.
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
if (process.env.RUN_DB_TESTS !== '1') throw new Error('Set RUN_DB_TESTS=1 to use the configured database');
const pool = require('../config/db');
const emails = ['sendRegistrationEmail', 'sendBookingConfirmationEmail', 'sendBookingStatusEmail', 'sendAdminNotificationEmail', 'sendOtpEmail', 'sendPasswordResetOtpEmail'];
require.cache[require.resolve('../services/emailService')] = { loaded: true, exports: Object.fromEntries(emails.map(key => [key, async () => true])) };
const { app } = require('../index');

(async () => {
  const client = await pool.connect();
  const originalQuery = pool.query;
  let server;
  try {
    await client.query('BEGIN');
    pool.query = (...args) => client.query(...args);
    const prefix = `audit-${Date.now()}`;
    const password = 'TemporaryAudit!492';
    const hash = await bcrypt.hash(password, 10);
    const accounts = {};
    for (const role of ['admin', 'officer', 'student', 'staff']) {
      const email = `${role}-${prefix}@example.invalid`;
      const result = await client.query('INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4) RETURNING id', [`Audit ${role}`, email, hash, role]);
      accounts[role] = { id: result.rows[0].id, email };
    }
    server = app.listen(5099, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    async function request(path, { method = 'GET', body, token, status = 200 } = {}) {
      const res = await fetch(`http://127.0.0.1:5099/api${path}`, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
      const data = await res.json();
      assert.equal(res.status, status, `${method} ${path}: ${data.message || 'unexpected response'}`);
      return data;
    }
    for (const role of Object.keys(accounts)) {
      const result = await request('/auth/login', { method: 'POST', body: { email: ` ${accounts[role].email.toUpperCase()} `, password } });
      accounts[role].token = result.token;
    }
    console.log('PASS: login for all four roles, with whitespace and mixed-case emails');
    for (const path of ['/items', '/projects', '/people', '/news']) assert.ok(Array.isArray(await request(path)));
    await request('/bookings', { status: 401 });
    await request('/users', { token: accounts.student.token, status: 403 });
    console.log('PASS: public pages and protected API permissions');
    const project = { title: prefix, description: 'Audit project', lead: 'Lead', supervisor: 'Supervisor', team_members: 'A, B', tags: 'AI, CV', year: '2026', status: 'Active' };
    const created = await request('/projects', { method: 'POST', token: accounts.admin.token, body: project, status: 201 });
    const changed = await request(`/projects/${created.id}`, { method: 'PUT', token: accounts.admin.token, body: { ...project, team_members: 'A, B, C' } });
    assert.equal(changed.team_members, 'A, B, C');
    await request(`/projects/${created.id}`, { method: 'DELETE', token: accounts.admin.token });
    console.log('PASS: project create, update, and delete');
    const date = new Date(); date.setUTCDate(date.getUTCDate() + 14);
    while ([0, 6].includes(date.getUTCDay())) date.setUTCDate(date.getUTCDate() + 1);
    const day = date.toISOString().slice(0, 10);
    const booking = { requestType: 'Equipment Booking', resource: prefix, date: day, time: '08:00–10:00', purpose: 'Automated audit' };
    await request('/bookings', { method: 'POST', token: accounts.student.token, body: {}, status: 400 });
    await request('/bookings', { method: 'POST', token: accounts.student.token, body: { ...booking, date: '2026-02-30' }, status: 400 });
    const reservation = await request('/bookings', { method: 'POST', token: accounts.student.token, body: booking, status: 201 });
    const id = reservation.booking.id;
    assert.equal(reservation.booking.booking_date, day);
    await request(`/bookings/${id}/status`, { method: 'PUT', token: accounts.student.token, body: { status: 'Approved' }, status: 403 });
    await request(`/bookings/${id}/status`, { method: 'PUT', token: accounts.officer.token, body: { status: 'Invalid' }, status: 400 });
    await request(`/bookings/${id}/status`, { method: 'PUT', token: accounts.officer.token, body: { status: 'Rescheduled' }, status: 400 });
    await request(`/bookings/${id}/status`, { method: 'PUT', token: accounts.officer.token, body: { status: 'Rescheduled', booking_date: day, time_slot: '10:00–12:00', admin_notes: 'Bring ID' } });
    const approved = await request(`/bookings/${id}/status`, { method: 'PUT', token: accounts.officer.token, body: { status: 'Approved' } });
    assert.equal(approved.booking.admin_notes, 'Bring ID');
    assert.equal(approved.booking.booking_date, day);
    const mine = await request('/bookings?mine=true', { token: accounts.student.token });
    assert.ok(mine.some(row => row.id === id));
    assert.ok(mine.every(row => row.user_id === accounts.student.id));
    const staff = await request('/bookings', { token: accounts.staff.token });
    assert.ok(staff.every(row => row.user_id === accounts.staff.id));
    const analytics = await request('/analytics', { token: accounts.officer.token });
    assert.ok(analytics.usage.some(row => row.resource === prefix && row.approved === 1));
    console.log('PASS: booking validation, date serialization, rescheduling, approval, notes, privacy, and live analytics');
    await client.query('UPDATE users SET role=$1 WHERE id=$2', ['student', accounts.admin.id]);
    await request('/users', { token: accounts.admin.token, status: 403 });
    await client.query('UPDATE users SET role=$1 WHERE id=$2', ['admin', accounts.admin.id]);
    console.log('PASS: role changes invalidate stale elevated permissions');
    if (process.env.AUDIT_HOLD === '1') {
      // These accounts exist only inside this uncommitted audit transaction.
      console.log(`BROWSER_AUDIT login=${accounts.admin.email} password=${password}`);
      console.log('Audit API ready on port 5099. Send any input to roll back and exit.');
      await Promise.race([new Promise(resolve => process.stdin.once('data', resolve)), new Promise(resolve => setTimeout(resolve, 15 * 60 * 1000))]);
    }
  } finally {
    if (server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
    pool.query = originalQuery;
    await client.query('ROLLBACK');
    console.log('Audit data rolled back. No test records retained.');
    client.release();
    await pool.end();
  }
})().then(() => process.exit(0)).catch(error => { console.error(error.message); process.exit(1); });
