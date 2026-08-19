import { createBrowserRouter } from "react-router";
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import PetsList from "./pages/shelter/PetsList";

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
      { path: "shelter/pets", element: <PetsList /> },
    ],
  },
]);