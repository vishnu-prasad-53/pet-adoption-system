import { useEffect, useState } from "react";
import { fetchPets, createPet, deletePet, updatePet } from "../services/api";

export default function ManagePets() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: "",
    image: ""
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = () => {
    fetchPets().then(data => setPets(data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    if (editId) {
      await updatePet(editId, { ...form, role: user.role });
      alert("Updated!");
      setEditId(null);
    } else {
      await createPet({ ...form, role: user.role });
      alert("Added!");
    }

    setForm({ name: "", breed: "", age: "", image: "" });
    loadPets();
  };

  const handleEdit = (pet) => {
    setForm(pet);
    setEditId(pet.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this pet?")) return;

    const user = JSON.parse(localStorage.getItem("user"));
    await deletePet(id, user.role);

    alert("Deleted!");
    loadPets();
  };

  return (
    <div className="container">
      <h2>Manage Pets 🛠️</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} />
        <br /><br />

        <input placeholder="Breed" value={form.breed}
          onChange={e => setForm({ ...form, breed: e.target.value })} />
        <br /><br />

        <input placeholder="Age" value={form.age}
          onChange={e => setForm({ ...form, age: e.target.value })} />
        <br /><br />

        <input placeholder="Image URL" value={form.image}
          onChange={e => setForm({ ...form, image: e.target.value })} />
        <br /><br />

        <button>{editId ? "Update Pet" : "Add Pet"}</button>
      </form>

      <h3>All Pets</h3>

      {pets.map(p => (
        <div key={p.id} className="card">
          <img src={p.image} alt={p.name} />

          <div>
            <h4>{p.name}</h4>
            <p>{p.breed}</p>
            <p>{p.age}</p>

            <button onClick={() => handleEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}