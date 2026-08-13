import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "./lib/api";

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiRequest("/api/me"),
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Not logged in</h1>;
  }

  return (
    <div>
      <h1>Welcome!</h1>
      <p>Name: {data.user.name}</p>
      <p>Email: {data.user.email}</p>
      <p>Role: {data.user.role}</p>
    </div>
  );
}

export default App;