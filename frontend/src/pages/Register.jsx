import React, { useState } from "react";
import { api } from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [password, setPassword] = useState("");
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr(""); setOk("");
    try {
      await api("/auth/register", { method: "POST", body: { name, email, role, password } });
      setOk("Account created. Now go to Login.");
      setName(""); setEmail(""); setPassword("");
    } catch (ex) {
      setErr(ex.message);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Register</h1>
        {err && <p style={{ color: "#ffb4b4" }}>{err}</p>}
        {ok && <p style={{ color: "#b6ffd1" }}>{ok}</p>}
        <form onSubmit={submit} className="row">
          <input className="input" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <select className="input" value={role} onChange={(e)=>setRole(e.target.value)}>
            <option value="STUDENT">STUDENT</option>
            <option value="PROFESSOR">PROFESSOR</option>
          </select>
          <input className="input" placeholder="Password (min 6)" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button className="btn" type="submit">Create account</button>
        </form>
      </div>
    </div>
  );
}
