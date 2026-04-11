import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPets } from "../services/api";

const Pets = () => {
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPets()
      .then(data => setPets(data));
  }, []);

  return (
    <div className="container">
      <h2>Available Pets</h2>
      {pets.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No pets available right now 🐾
        </p>
      ) : (pets.map(pet => (
        <div className="card" key={pet.pet_id}>
          <img src={pet.image || "https://via.placeholder.com/120"} alt={pet.name} />
          <div>
            <h3>{pet.name}</h3>
            <p>Breed: {pet.breed}</p>
            <p>Age: {pet.age}</p>
            <button onClick={() => navigate("/apply", { state: pet.id })}>Adopt</button>
          </div>
        </div>
      )))}
    </div>
  );
};

export default Pets;