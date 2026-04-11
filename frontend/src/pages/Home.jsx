import AdminDashboard from "./AdminDashboard";
import Pets from "./Pets";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  return <Pets />;
}