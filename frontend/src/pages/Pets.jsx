import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPets } from "../services/api";

const Pets = () => {
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPets()
    .then(res => res.json())
    .then(data => setPets(data));
  }, []);

  return (
    <div className="container">
      <h2>Available Pets</h2>
      {pets.map(pet => (
        <div className="card" key={pet.id}>
          <img src={pet.image} alt={pet.name} width="150" />
          <p>{pet.name} - {pet.breed}</p>
          <button onClick={() => navigate("/apply", { state: pet.id })}>Adopt</button>
        </div>
      ))}
    </div>
  );
};

export default Pets;