import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <h3>Pet Adoption</h3>

      <div>
        <Link to="/">Home</Link>

        {user?.role === "admin" && (
          <>
            <Link to="/admin/manage">Manage Pets</Link>
            <Link to="/admin/adoptions">Requests</Link>
          </>
        )}

        {user && user.role !== "admin" && (
          <Link to="/my-applications">My Applications</Link>
        )}

        {user ? (
          <>
            <span style={{ marginLeft: "10px" }}>
              Welcome {user.name}
            </span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}