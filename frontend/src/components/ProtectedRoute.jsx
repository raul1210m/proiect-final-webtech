import React from "react";

export default function ProtectedRoute({ auth, children }) {
  if (!auth?.token) {
    return (
      <div className="container">
        <div className="card">
          <h2>Not authenticated</h2>
          <p className="small">Please login first.</p>
        </div>
      </div>
    );
  }
  return children;
}
