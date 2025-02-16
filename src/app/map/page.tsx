"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import Map from "@/components/map";
import Sidebar from "@/components/sidebar";
import { checkAuthStatus } from "@/app/utils/auth";
import signInWithGoogle from "@/supabase/auth/signIn";
import { useRouter } from "next/navigation";

export default function MapPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const router = useRouter(); // Router for navigation

  const handleReportClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default Link behavior

    const isAuthenticated = await checkAuthStatus();

    if (!isAuthenticated) {
    window.localStorage.setItem("pendingAction", "/report"); // Store pending action
      await signInWithGoogle(); // Start sign-in flow
      return;
    }

    // If user is signed in, go to /report
    router.push("/report");
  };

  return (
    <div className="flex h-[100vh] w-full overflow-hidden">
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
      <div className="flex-1 relative">
        <Map />
      </div>
        <Button onClick={handleReportClick} className="absolute bottom-6 right-6 group h-12 w-12 rounded-full bg-gradient-to-tr from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 shadow-[0_8px_30px_rgb(245,158,11,0.2)] hover:shadow-[0_8px_30px_rgb(245,158,11,0.4)] backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300">
          <AlertTriangle className="h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
          <span className="sr-only">Report an incident</span>
        </Button>
    </div>
  );
}