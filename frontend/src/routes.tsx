import { createBrowserRouter } from "react-router";
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Browse from "./pages/Browse";
import PetsList from "./pages/shelter/PetsList";
import PetForm from "./pages/shelter/PetForm";
import Settings from "./pages/shelter/Settings";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import PetDetail from "./pages/PetDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Browse /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: "dashboard", element: <Dashboard /> }],
      },
      { path: "pets/:id", element: <PetDetail /> },
      {
        element: <ProtectedRoute allowedRoles={["shelter_staff"]} />,
        children: [
          { path: "shelter/pets", element: <PetsList /> },
          { path: "shelter/pets/new", element: <PetForm /> },
          { path: "shelter/pets/:id/edit", element: <PetForm /> },
          { path: "shelter/settings", element: <Settings /> },
        ],
      },
    ],
  },
]);