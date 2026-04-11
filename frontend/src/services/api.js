const API_URL = import.meta.env.VITE_API_URL;

export const fetchPets = async () => {
  const res = await fetch(`${API_URL}/pets`);
  return res.json();
}

export const createPet = async (petData) => {
  const res = await fetch(`${API_URL}/pets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(petData),
  });
  return res.json();
}

export const deletePet = async (id) => {
  const res = await fetch(`${API_URL}/pets/${id}`, {
    method: "DELETE",
  });
  return res.json();
};

export const updatePet = async (id, data) => {
  const res = await fetch(`${API_URL}/pets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const applyAdoption = async (data) => {
  const res = await fetch(`${API_URL}/adoptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const fetchAdoptions = async () => {
  const res = await fetch(`${API_URL}/adoptions`);
  return res.json();
};

export const updateAdoption = async (id, status) => {
  const res = await fetch(`${API_URL}/adoptions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
};