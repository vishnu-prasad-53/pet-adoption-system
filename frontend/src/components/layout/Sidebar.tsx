export function Sidebar({ role }: { role: string }) {
  return (
    <aside className="w-56 border-r p-4 space-y-2">
      {role === "shelter_staff" && <nav className="flex flex-col gap-2 text-sm" />}
      {role === "admin" && <nav className="flex flex-col gap-2 text-sm" />}
    </aside>
  );
}