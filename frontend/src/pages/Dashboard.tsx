import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { session } = useAuth();
  return (
    <div>
      <h1 className="text-xl font-semibold">Welcome, {session?.user.name}</h1>
      <p className="text-muted-foreground">Role: {session?.user.role}</p>
    </div>
  );
}