import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../hooks/useAuth";

export function AppShell({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const role = session?.user?.role;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {role && role !== "adopter" && <Sidebar role={role} />}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}