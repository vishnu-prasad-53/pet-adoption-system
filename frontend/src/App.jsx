import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Pets from "./pages/Pets";
import Apply from "./pages/Apply";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <h2>Pet Adoption System</h2>
        <div>
          <Link to="/">Pets</Link>
          <Link to="/apply">Apply</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Pets />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;