import { Link } from "react-router";

export function Sidebar({ role }: { role: string }) {
  return (
    <aside className="w-56 border-r p-4 space-y-2">
      {role === "shelter_staff" && (
        <nav className="flex flex-col gap-2 text-sm">
          <Link to="/shelter/pets">My Pets</Link>
          <Link to="/shelter/settings">Settings</Link>
        </nav>
      )}
      {role === "admin" && <nav className="flex flex-col gap-2 text-sm" />}
    </aside>
  );
}