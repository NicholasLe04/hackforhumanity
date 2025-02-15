'use client'
import signInWithGoogle from "@/supabase/auth/signIn";
import signOut from "@/supabase/auth/signOut";
import { useAuthContext } from "@/context/AuthContext";
import MapLayout from "@/components/map-layout"
import Link from 'next/link';

export default function Home() {
  const { user } = useAuthContext() as { user: any };
  return (
/*     <div className="flex flex-col">
      {user && user.email}
      <button onClick={signInWithGoogle}>
        sign in
      </button>
      <button onClick={signOut}>
        sign out
      </button>
    <div> */
    <div>
      <MapLayout />
      <Link 
        href="/report" 
        className="fixed bottom-8 right-8 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        Report Incident
      </Link>
    </div>
  );
}
