'use client'
import signInWithGoogle from "@/supabase/auth/signIn";
import signOut from "@/supabase/auth/signOut";
import { useAuthContext } from "@/context/AuthContext";
import MapLayout from "@/components/map-layout"
import Link from 'next/link';
import LandingPage from "./components/LandingPage";

export default function Home() {
  const { user } = useAuthContext() as { user: any };
  return (
    <LandingPage/>
  );
}
