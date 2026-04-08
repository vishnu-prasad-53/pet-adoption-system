import { Link } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="navbar">
      <h3>Pet Adoption</h3>

      <div>
        <Link to="/">Home</Link>

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