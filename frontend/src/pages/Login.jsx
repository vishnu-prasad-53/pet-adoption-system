import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return alert("All fields required");
    }

    loginUser(form).then((res) => {
      if (res.message !== "Login successful") {
        return alert(res.message);
      }

      localStorage.setItem("user", JSON.stringify(res.user));

      alert("Login successful");
      navigate("/");
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Email"
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit">Login</button>
        </form>

        <div className="auth-link">
          Don’t have an account? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
}