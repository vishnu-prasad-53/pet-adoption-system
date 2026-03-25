import { useEffect, useState } from "react";
import { fetchPets } from "../services/api";

const Pets = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    fetchPets().then((data) => setPets(data));
  }, []);

  return (
    <div>
      <h2>Available Pets</h2>
      {pets.map((pet) => (
        <div key={pet.id}>
          <p>{pet.name} - {pet.breed}</p>
        </div>
      ))}
    </div>
  );
};

export default Pets;