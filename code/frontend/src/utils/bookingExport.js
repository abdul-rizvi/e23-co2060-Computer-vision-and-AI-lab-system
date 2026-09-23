export function bookingsToCSV(bookings) {
  const rows = [
    ["ID", "Resource", "Date", "Time", "Status", "Notes"],
    ...bookings.map((booking) => [
      `R-${booking.id}`,
      booking.resource,
      new Date(booking.booking_date).toLocaleDateString(),
      booking.time_slot,
      booking.status,
      booking.admin_notes,
    ]),
  ];
  return rows.map((row) => row.map((value) =>
    `"${String(value ?? "").replaceAll('"', '""')}"`
  ).join(",")).join("\r\n");
}

export function bookingQRUrl(booking) {
  const data = encodeURIComponent(`BOOKING-${booking.id}-${booking.resource}`);
  return `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${data}`;
}
