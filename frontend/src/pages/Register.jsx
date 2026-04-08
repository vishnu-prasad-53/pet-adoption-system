import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return alert("All fields required");
    }

    if (form.password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    registerUser(form).then((res) => {
      alert(res.message);
      navigate("/login");
    });
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
        <br /><br />
        <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
        <br /><br />
        <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
        <br /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}