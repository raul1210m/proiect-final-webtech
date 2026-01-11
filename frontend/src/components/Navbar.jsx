import React from "react";
import { clearAuth } from "../auth";

export default function Navbar({ auth, onLogout }) {
  return (
    <div className="nav">
      <div>
        <b>Dissertation System</b>{" "}
        <span className="small">({auth.user.role})</span>
      </div>
      <div className="row" style={{ alignItems: "center" }}>
        <span className="small">{auth.user.name} — {auth.user.email}</span>
        <button
          className="btn"
          onClick={() => {
            clearAuth();
            onLogout();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
