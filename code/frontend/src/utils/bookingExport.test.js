import assert from "node:assert/strict";
import { test } from "node:test";
import { bookingsToCSV, bookingQRUrl } from "./bookingExport.js";

test("CSV preserves commas, quotes, and multiline booking notes", () => {
  const csv = bookingsToCSV([{
    id: 7,
    resource: 'Camera, 6" lens',
    booking_date: "2026-09-23",
    time_slot: "08:00–10:00",
    status: "Approved",
    admin_notes: 'Bring "ID"\nand a tripod',
  }]);
  assert.equal(csv, '"ID","Resource","Date","Time","Status","Notes"\r\n' +
    `"R-7","Camera, 6"" lens","${new Date("2026-09-23").toLocaleDateString()}",` +
    '"08:00–10:00","Approved","Bring ""ID""\nand a tripod"');
});

test("CSV leaves missing notes blank and separates multiple bookings", () => {
  const booking = { id: 1, resource: "GPU", booking_date: "2026-09-23", time_slot: "AM", status: "Pending" };
  const rows = bookingsToCSV([booking, { ...booking, id: 2 }]).split("\r\n");
  assert.equal(rows.length, 3);
  assert.ok(rows[1].endsWith(',""'));
  assert.ok(rows[2].startsWith('"R-2",'));
});

test("QR data preserves URL delimiters and Unicode in resource names", () => {
  const booking = { id: 9, resource: "Camera & GPU #2 + sensor / µ" };
  const url = new URL(bookingQRUrl(booking));
  assert.equal(url.searchParams.get("data"), `BOOKING-9-${booking.resource}`);
  assert.equal(url.searchParams.get("size"), "170x170");
  assert.equal(url.hash, "");
  assert.equal([...url.searchParams].length, 2);
});
