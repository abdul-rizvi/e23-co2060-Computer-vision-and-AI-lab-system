const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { transformSync } = require('esbuild');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

// Compile source for offline rendering without starting a browser or API server.
const sourceRoot = path.resolve(__dirname, '../src') + path.sep;
const originalJS = require.extensions['.js'];
function compile(module, filename) {
  if (!filename.startsWith(sourceRoot)) return originalJS(module, filename);
  const result = transformSync(fs.readFileSync(filename, 'utf8'), {
    loader: 'jsx', format: 'cjs', jsx: 'automatic',
    define: { 'import.meta.env.VITE_API_URL': '"http://localhost:5000"' },
  });
  module._compile(result.code, filename);
}
require.extensions['.jsx'] = compile;
require.extensions['.js'] = compile;
const { DocumentationPage } = require('../src/pages/DocumentationPage.jsx');
const { EquipmentPhoto } = require('../src/components/EquipmentPhoto.jsx');
const { VideoMedia } = require('../src/components/VideoMedia.jsx');
const { VirtualLabTour } = require('../src/components/VirtualLabTour.jsx');
const { StudentPortal } = require('../src/portal/StudentPortal.jsx');
const { PORTAL_MENUS } = require('../src/data/labData.js');
const render = (component, props) => renderToStaticMarkup(React.createElement(component, props));

test('every guideline link has readable target content', () => {
  const html = render(DocumentationPage);
  const anchors = [...html.matchAll(/href="#([^"]+)"/g)];
  assert.equal(anchors.length, 4);
  for (const [, id] of anchors) assert.ok(html.includes(`id="${id}"`));
  assert.ok(html.includes('Safety and equipment handling'));
  assert.ok(html.includes('Request lab access or equipment'));
});
test('equipment without a photo is explicitly a placeholder', () => {
  assert.match(render(EquipmentPhoto, { item: { name: 'Server' } }), /Equipment photo pending/);
  assert.match(render(EquipmentPhoto, { item: { name: 'Camera', image_url: 'https://example.com/camera.png' } }), /alt="Camera"/);
});
test('direct video files have playback controls and unsafe URLs are not links', () => {
  assert.match(render(VideoMedia, { url: 'https://example.com/demo.mp4', title: 'Workshop' }), /<video controls/);
  assert.doesNotMatch(render(VideoMedia, { url: 'javascript:alert(1)' }), /href=/);
});
test('walkthrough works as an explicitly illustrated local demo', () => {
  const html = render(VirtualLabTour);
  assert.match(html, /not a recording or the actual lab layout/);
  assert.match(html, /Server area/);
  assert.match(html, /Next stop/);
  assert.doesNotMatch(html, /iframe/);
});
test('booking filters and management navigation are present', () => {
  const html = render(StudentPortal, { active: 'history' });
  assert.match(html, /Filter bookings/);
  assert.match(html, /Staff notes/);
  assert.match(html, /value="Approved"/);
  assert.ok(PORTAL_MENUS.admin.some(item => item.id === 'projects'));
  assert.ok(PORTAL_MENUS.officer.some(item => item.id === 'overview'));
  assert.ok(PORTAL_MENUS.staff.some(item => item.id === 'booking'));
});
