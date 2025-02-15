'use client'
import signInWithGoogle from "@/supabase/auth/signIn";
import signOut from "@/supabase/auth/signOut";
import { useAuthContext } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuthContext() as { user: any };
  return (
    <div className="flex flex-col">
      {user && user.email}
      <button onClick={signInWithGoogle}>
        sign in
      </button>
      <button onClick={signOut}>
        sign out
      </button>
    </div>
  );
}
