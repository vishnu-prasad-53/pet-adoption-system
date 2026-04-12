import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPets } from "../services/api";

export default function AdminDashboard() {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      alert("Access denied");
      navigate("/");
    } else {
      fetchPets().then(data => setPets(data));
    }
  }, []);

  // 🔍 Filter + Search logic
  const filteredPets = pets.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter ? p.breed === filter : true)
  );

  const breeds = [...new Set(pets.map(p => p.breed))];

  return (
    <div className="container">
      <h2>Admin Dashboard 📊</h2>

      {/* SEARCH */}
      <input
        placeholder="Search by name..."
        onChange={e => setSearch(e.target.value)}
      />

      {/* FILTER */}
      <select onChange={e => setFilter(e.target.value)}>
        <option value="">All Breeds</option>
        {breeds.map(b => (
          <option key={b}>{b}</option>
        ))}
      </select>

      <br /><br />

      <button onClick={() => navigate("/admin/manage")}>
        Manage Pets
      </button>

      <h3>All Pets</h3>

      {filteredPets.map(p => (
        <div key={p.id} className="card">
          <img src={`http://localhost:5000/uploads/${p.image}`} alt={p.name} />
          <div>
            <h3>{p.name}</h3>
            <p>Breed: {p.breed}</p>
            <p>Age: {p.age}</p>
          </div>
        </div>
      ))}
    </div>
  );
}