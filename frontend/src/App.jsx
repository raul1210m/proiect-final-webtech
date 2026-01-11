import React, { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import ProfessorDashboard from "./pages/ProfessorDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import { loadAuth } from "./auth.js";

export default function App() {
  const [auth, setAuth] = useState(null);
  const [page, setPage] = useState("login"); // login | register | dashboard

  useEffect(() => {
    const saved = loadAuth();
    if (saved?.token) {
      setAuth(saved);
      setPage("dashboard");
    }
  }, []);

  function onAuth(a) {
    setAuth(a);
    setPage("dashboard");
  }

  function logout() {
    setAuth(null);
    setPage("login");
  }

  const isLogged = !!auth?.token;

  return (
    <div>
      {isLogged ? (
        <Navbar auth={auth} onLogout={logout} />
      ) : (
        <div className="nav">
          <div>
            <b>Dissertation System</b> <span className="small">(demo)</span>
          </div>
          <div className="row">
            <button className="btn" onClick={() => setPage("login")}>
              Login
            </button>
            <button className="btn" onClick={() => setPage("register")}>
              Register
            </button>
          </div>
        </div>
      )}

      {!isLogged && page === "login" && <Login onAuth={onAuth} />}
      {!isLogged && page === "register" && <Register />}

      {isLogged && (
        <ProtectedRoute auth={auth}>
          {auth.user.role === "STUDENT" ? (
            <StudentDashboard auth={auth} />
          ) : (
            <ProfessorDashboard auth={auth} />
          )}
        </ProtectedRoute>
      )}
    </div>
  );
}
