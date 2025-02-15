'use client'
import signInWithGoogle from "@/supabase/auth/signIn";
import signOut from "@/supabase/auth/signOut";
import { useAuthContext } from "@/context/AuthContext";
import MapLayout from "@/components/map-layout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { User } from "@supabase/supabase-js";

export default function MapPage() {
  const { user } = useAuthContext() as { user: User };
  
  return (
    <div>
      <div className="flex flex-col">
        {user && user.email}
        <button onClick={signInWithGoogle}>
          sign in
        </button>
        <button onClick={signOut}>
          sign out
        </button>
      </div>
      <div className="relative">
        <MapLayout />
        <Link href="/report" className="absolute bottom-6 right-6">
          <Button className="h-14 w-14 rounded-full shadow-lg border-2 border-black bg-white hover:bg-black/10 transition-colors duration-200">
            <Plus className="h-6 w-6 text-black" />
            <span className="sr-only">Add accident report</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}