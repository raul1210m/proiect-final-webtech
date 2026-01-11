import React, { useState } from "react";
import { api } from "../api";
import { saveAuth } from "../auth";

export default function Login({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const data = await api("/auth/login", { method: "POST", body: { email, password } });
      saveAuth(data);
      onAuth(data);
    } catch (ex) {
      setErr(ex.message);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Login</h1>
        {err && <p style={{ color: "#ffb4b4" }}>{err}</p>}
        <form onSubmit={submit} className="row">
          <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button className="btn" type="submit">Login</button>
        </form>
        <p className="small" style={{ marginTop: 10 }}>
          Tip: creează cont din Register (sus în App).
        </p>
      </div>
    </div>
  );
}
