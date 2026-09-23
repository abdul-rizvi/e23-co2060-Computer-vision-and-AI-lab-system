const TIME_SLOTS = ["08:00–10:00", "10:00–12:00", "13:00–15:00", "15:00–17:00", "17:00–19:00"];

function validateSchedule(date, time) {
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return "A valid booking date is required";
    const parsed = new Date(`${date}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return "Invalid booking date";
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    if (date < today) return "Booking date cannot be in the past";
    if ([0, 6].includes(parsed.getUTCDay())) return "Please choose a weekday";
    if (!TIME_SLOTS.includes(time)) return "Select a valid time slot";
    return null;
}

module.exports = { validateSchedule };
