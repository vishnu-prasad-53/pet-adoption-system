import { Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { authClient } from "../../lib/auth-client";
import { Button } from "../../components/ui/button";

export function Navbar() {
  const { session } = useAuth();

  return (
    <header className="border-b px-6 py-3 flex items-center justify-between">
      <Link to="/" className="font-semibold">Pet Adoption Platform</Link>
      <nav className="flex items-center gap-4">
        {session?.user ? (
          <>
            <span className="text-sm text-muted-foreground">{session.user.email}</span>
            <Button variant="outline" size="sm" onClick={() => authClient.signOut()}>Log out</Button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm">Log in</Link>
            <Link to="/signup" className="text-sm">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}