import { useEffect, useState } from "react";
import API from "../services/api";
import { Button, PStat, PTable } from "../components/UI";

export function Statistics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await API.get("/api/analytics");
      setData(response.data);
    } catch {
      setError("Statistics could not be loaded. Try again.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);
  return <section style={{ marginBottom: "2rem" }}>
    <h2>Reservation statistics</h2>
    <Button variant="outline" onClick={load} disabled={loading}>Refresh statistics</Button>
    {error && <p role="alert">{error}</p>}
    {loading ? <p>Loading statistics…</p> : !error && data && <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", margin: "1rem 0" }}>
        <PStat label="Users" value={data.users.total} />
        <PStat label="Pending" value={data.bookings.pending} />
        <PStat label="Approved" value={data.bookings.approved} />
        <PStat label="Rejected" value={data.bookings.rejected} />
        <PStat label="Rescheduled" value={data.bookings.rescheduled} />
      </div>
      <h3>Equipment reservation summary</h3>
      <p>All-time request counts per resource. These indicate reservations, not measured device runtime.</p>
      {data.usage?.length ? <PTable cols={["Resource", "Requests", "Pending", "Approved", "Rejected", "Rescheduled"]}
        rows={data.usage.map((row) => [row.resource, row.total, row.pending, row.approved, row.rejected, row.rescheduled])} /> : <p>No equipment or reservations recorded.</p>}
    </>}
  </section>;
}
