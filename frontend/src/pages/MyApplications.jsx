import { useEffect, useState } from "react";
import { fetchUserAdoptions } from "../services/api";

export default function MyApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      fetchUserAdoptions(user.email).then(data => setApps(data));
    }
  }, []);

  return (
    <div className="container">
      <h2>My Applications 🐾</h2>

      {apps.length === 0 ? (
        <p>No applications yet</p>
      ) : (
        apps.map(app => (
          <div key={app.id} className="card">
            <img
              src={`http://localhost:5000/uploads/${app.image}`}
              alt={app.pet_name}
            />

            <div>
              <h3>{app.pet_name}</h3>
              <p>Status: 
                <span style={{
                  color:
                    app.status === "approved" ? "green" :
                    app.status === "rejected" ? "red" : "orange"
                }}>
                  {" "}{app.status}
                </span>
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}