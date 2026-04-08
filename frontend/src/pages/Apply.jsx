import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Apply() {
  const navigate = useNavigate();
  const location = useLocation();
  const petId = location.state;

  const [form, setForm] = useState({
    name: "",
    email: "",
    pet_id: petId
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      navigate("/login");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Application submitted!");
    navigate("/");
  };

  return (
    <div className="container">
      <h2>Apply for Adoption</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
        <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
        <input value={form.pet_id} readOnly />

        <br /><br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}