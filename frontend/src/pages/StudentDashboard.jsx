import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function StudentDashboard({ auth }) {
  const token = auth.token;
  const [sessions, setSessions] = useState([]);
  const [myReq, setMyReq] = useState([]);
  const [err, setErr] = useState("");

  const [applySessionId, setApplySessionId] = useState("");
  const [justification, setJustification] = useState("");
  const [studentDocUrl, setStudentDocUrl] = useState("");

  async function load() {
    setErr("");
    try {
      const s = await api("/sessions", { token });
      const r = await api("/requests/mine", { token });
      setSessions(s);
      setMyReq(r);
    } catch (ex) {
      setErr(ex.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function apply(e) {
    e.preventDefault();
    setErr("");
    try {
      if (!applySessionId) {
        setErr("Please select a session first.");
        return;
      }

      await api("/requests", {
        method: "POST",
        token,
        body: {
          sessionId: Number(applySessionId),
          justification,
          studentDocUrl
        }
      });

      setApplySessionId("");
      setJustification("");
      setStudentDocUrl("");

      await load();
      alert("Applied successfully!");
    } catch (ex) {
      setErr(ex.message);
    }
  }

  const hasApproved = myReq.some((r) => r.status === "APPROVED");

  return (
    <div className="container">
      <div className="row">
        <div className="card" style={{ flex: 2, minWidth: 320 }}>
          <h1>Student Dashboard</h1>
          <p className="small">
            Browse sessions and apply. Rule: you can’t have 2 approved requests.
          </p>

          {err && <p style={{ color: "#ffb4b4" }}>{err}</p>}

          <h2>Apply to a session</h2>
          {hasApproved ? (
            <p className="small">
              You already have an <span className="badge approved">APPROVED</span> request.
              You can still view sessions, but applying is blocked by the backend rule.
            </p>
          ) : (
            <form onSubmit={apply} className="row">
              <select
                className="input"
                value={applySessionId}
                onChange={(e) => setApplySessionId(e.target.value)}
              >
                <option value="">Select a session...</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    #{s.id} — {s.professor?.name || "Professor"} — {new Date(s.startDate).toLocaleDateString()}
                  </option>
                ))}
              </select>

              <input
                className="input"
                placeholder="Justification (optional)"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
              />

              <input
                className="input"
                placeholder="Student Doc URL (optional)"
                value={studentDocUrl}
                onChange={(e) => setStudentDocUrl(e.target.value)}
              />

              <button className="btn" type="submit">
                Apply
              </button>
            </form>
          )}

          <h2 style={{ marginTop: 18 }}>All sessions</h2>
          <div className="row">
            {sessions.map((s) => (
              <div key={s.id} className="card" style={{ width: "100%" }}>
                <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <b>Session #{s.id}</b>{" "}
                    <span className="small">by {s.professor?.name} ({s.professor?.email})</span>
                    <div className="small">
                      {s.description || "(no description)"}
                    </div>
                  </div>
                  <div className="small" style={{ textAlign: "right" }}>
                    <div>Start: {new Date(s.startDate).toLocaleString()}</div>
                    <div>End: {new Date(s.endDate).toLocaleString()}</div>
                    <div>Max slots: {s.maxSlots}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ flex: 1, minWidth: 320 }}>
          <h2>My requests</h2>
          <p className="small">Your applications and statuses.</p>

          {myReq.length === 0 ? (
            <p className="small">No requests yet.</p>
          ) : (
            myReq.map((r) => (
              <div key={r.id} className="card" style={{ marginBottom: 12 }}>
                <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <b>Request #{r.id}</b>
                  <span className={`badge ${r.status.toLowerCase()}`}>
                    {r.status}
                  </span>
                </div>

                <div className="small" style={{ marginTop: 6 }}>
                  Session #{r.session?.id} — {r.session?.professor?.name} ({r.session?.professor?.email})
                </div>

                {r.justification && (
                  <div className="small" style={{ marginTop: 6 }}>
                    <b>Justification:</b> {r.justification}
                  </div>
                )}

                {r.studentDocUrl && (
                  <div className="small" style={{ marginTop: 6 }}>
                    <b>Student doc:</b>{" "}
                    <a href={r.studentDocUrl} target="_blank" rel="noreferrer">
                      open
                    </a>
                  </div>
                )}

                {r.profDocUrl && (
                  <div className="small" style={{ marginTop: 6 }}>
                    <b>Professor doc:</b>{" "}
                    <a href={r.profDocUrl} target="_blank" rel="noreferrer">
                      open
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
