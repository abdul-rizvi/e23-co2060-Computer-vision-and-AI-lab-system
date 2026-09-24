import { StudentPortal } from "./StudentPortal";

// Staff use the same account-specific reservation and announcement views.
export function StaffPortal({ active }) {
  return <StudentPortal active={active === "dashboard" || active === "reservations" ? "history" : active} />;
}
