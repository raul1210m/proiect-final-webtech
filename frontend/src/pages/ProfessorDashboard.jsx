import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";

export default function ProfessorDashboard({ auth }) {
  const token = auth.token;

  const [mine, setMine] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [err, setErr] = useState("");

  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxSlots, setMaxSlots] = useState(5);

  async function load() {
    setErr("");
    try {
      const s = await api("/sessions/mine", { token });
      const r = await api("/requests/inbox", { token });
      setMine(s);
      setInbox(r);
    } catch (ex) {
      setErr(ex.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createSession(e) {
    e.preventDefault();
    setErr("");
    try {
      if (!startDate || !endDate) {
        setErr("StartDate and EndDate are required.");
        return;
      }

      const body = {
        description: description || null,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        maxSlots: Number(maxSlots) || 5
      };

      await api("/sessions", { method: "POST", token, body });

      setDescription("");
      setStartDate("");
      setEndDate("");
      setMaxSlots(5);

      await load();
      alert("Session created!");
    } catch (ex) {
      setErr(ex.message);
    }
  }

  async function setRequestStatus(requestId, status) {
    setErr("");
    try {
      await api(`/requests/${requestId}`, {
        method: "PUT",
        token,
        body: { status }
      });
      await load();
    } catch (ex) {
      setErr(ex.message);
    }
  }

  const stats = useMemo(() => {
    const pending = inbox.filter((r) => r.status === "PENDING").length;
    const approved = inbox.filter((r) => r.status === "APPROVED").length;
    const rejected = inbox.filter((r) => r.status === "REJECTED").length;
    return { pending, approved, rejected };
  }, [inbox]);

  return (
    <div className="container">
      <div className="card">
        <h1>Professor Dashboard</h1>
        <p className="small">
          Create sessions and manage student requests (approve / reject).
        </p>
        {err && <p style={{ color: "#ffb4b4" }}>{err}</p>}
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <div className="card" style={{ flex: 1, minWidth: 320 }}>
          <h2>Create session</h2>
          <form onSubmit={createSession} className="row">
            <input
              className="input"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              className="input"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              className="input"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <input
              className="input"
              type="number"
              min="1"
              value={maxSlots}
              onChange={(e) => setMaxSlots(e.target.value)}
            />
            <button className="btn" type="submit">
              Create
            </button>
          </form>

          <h2 style={{ marginTop: 16 }}>My sessions</h2>
          {mine.length === 0 ? (
            <p className="small">No sessions created yet.</p>
          ) : (
            mine.map((s) => (
              <div key={s.id} className="card" style={{ marginBottom: 12 }}>
                <b>Session #{s.id}</b>
                <div className="small">{s.description || "(no description)"}</div>
                <div className="small" style={{ marginTop: 6 }}>
                  Start: {new Date(s.startDate).toLocaleString()}
                  <br />
                  End: {new Date(s.endDate).toLocaleString()}
                  <br />
                  Max slots: {s.maxSlots}
                </div>
                <div className="small" style={{ marginTop: 6 }}>
                  Requests in this session: {Array.isArray(s.requests) ? s.requests.length : 0}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card" style={{ flex: 2, minWidth: 320 }}>
          <h2>Requests inbox</h2>
          <div className="row" style={{ marginBottom: 10 }}>
            <span className="badge pending">PENDING: {stats.pending}</span>
            <span className="badge approved">APPROVED: {stats.approved}</span>
            <span className="badge rejected">REJECTED: {stats.rejected}</span>
          </div>

          {inbox.length === 0 ? (
            <p className="small">No requests yet.</p>
          ) : (
            inbox.map((r) => (
              <div key={r.id} className="card" style={{ marginBottom: 12 }}>
                <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <b>Request #{r.id}</b>
                  <span className={`badge ${r.status.toLowerCase()}`}>{r.status}</span>
                </div>

                <div className="small" style={{ marginTop: 6 }}>
                  Student: {r.student?.name} ({r.student?.email})
                </div>

                <div className="small">
                  Session #{r.sessionId} (professorId: {r.session?.professorId})
                </div>

                {r.justification && (
                  <div className="small" style={{ marginTop: 6 }}>
                    <b>Student justification:</b> {r.justification}
                  </div>
                )}

                <div className="row" style={{ marginTop: 10 }}>
                  <button
                    className="btn"
                    onClick={() => setRequestStatus(r.id, "APPROVED")}
                    disabled={r.status === "APPROVED"}
                    title="Approve this request"
                  >
                    Approve
                  </button>
                  <button
                    className="btn"
                    onClick={() => setRequestStatus(r.id, "REJECTED")}
                    disabled={r.status === "REJECTED"}
                    title="Reject this request"
                  >
                    Reject
                  </button>
                  <button
                    className="btn"
                    onClick={() => setRequestStatus(r.id, "PENDING")}
                    disabled={r.status === "PENDING"}
                    title="Back to pending"
                  >
                    Set Pending
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
    