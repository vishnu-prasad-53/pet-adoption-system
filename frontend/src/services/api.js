const API_URL = import.meta.env.VITE_API_URL;

export const fetchPets = async () => {
  const res = await fetch(`${API_URL}/pets`);
  return res.json();
};

export const createPet = async (petData) => {
  const res = await fetch(`${API_URL}/pets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(petData),
  });

  return res.json();
};