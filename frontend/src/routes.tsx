import { createBrowserRouter } from "react-router";
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import PetsList from "./pages/shelter/PetsList";
import PetForm from "./pages/shelter/PetForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      {
        element: <ProtectedRoute />,
        children: [{ index: true, element: <Dashboard /> }],
      },
      {
        element: <ProtectedRoute allowedRoles={["shelter_staff"]} />,
        children: [
          { path: "shelter/pets", element: <PetsList /> },
          { path: "shelter/pets/new", element: <PetForm /> },
          { path: "shelter/pets/:id/edit", element: <PetForm /> },
        ],
      },
    ],
  },
]);