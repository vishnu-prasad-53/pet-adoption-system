import { useEffect, useState } from "react";
import { fetchAdoptions, updateAdoption } from "../services/api";

export default function AdoptionRequests() {
  const [requests, setRequests] = useState([]);

  const loadRequests = () => {
    fetchAdoptions().then(data => setRequests(data));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (id, status) => {
    await updateAdoption(id, status);
    alert(`Application ${status}`);
    loadRequests();
  };

  return (
    <div className="container">
      <h2>Adoption Requests 🐾</h2>

      {requests.map(r => (
        <div key={r.id} className="card">
          <img src={r.image} alt="pet" />

          <div>
            <h4>{r.pet_name}</h4>
            <p>User: {r.name}</p>
            <p>Email: {r.email}</p>
            <p>Status: {r.status}</p>

            {r.status === "pending" && (
              <>
                <button onClick={() => handleAction(r.id, "approved")}>
                  Approve
                </button>
                <button onClick={() => handleAction(r.id, "rejected")}>
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}