"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import Map from "@/components/map_component";
import Sidebar from "@/components/sidebar";
import PostModal from "@/components/post-modal";
import { checkAuthStatus } from "@/app/utils/auth";
import signInWithGoogle from "@/supabase/auth/signIn";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/client"
import { Post } from "@/supabase/schema"

export default function MapPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const router = useRouter();

  const handleReportClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    const isAuthenticated = await checkAuthStatus();

    if (!isAuthenticated) {
    window.localStorage.setItem("pendingAction", "/report");
      await signInWithGoogle();
      return;
    }

    // If user is signed in, go to /report
    router.push("/report");
  };

  const handleIncidentClick = (latitude: number, longitude: number) => {
    setSelectedLocation([longitude, latitude]);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from("posts").select("*");

        if (error) {
          console.error("Error fetching posts:", error);
          return;
        }

        if (data) {
          const postsWithImages = data.map((post) => {
            const imageUrl = supabase.storage
              .from("images")
              .getPublicUrl(`${post.id}`).data.publicUrl;

            return {
              ...post,
              imageUrl: imageUrl,
            };
          });

          setPosts(postsWithImages);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute top-0 left-0 h-full z-10">
        <Sidebar 
          isExpanded={isSidebarExpanded} 
          setIsExpanded={setIsSidebarExpanded} 
          posts={posts}
          onIncidentClick={handleIncidentClick}
        />
      </div>
      <div className="absolute inset-0">
        <Map 
          posts={posts} 
          selectedLocation={selectedLocation}
          onMarkerClick={setSelectedPost}
        />
      </div>
      <Button 
        onClick={handleReportClick} 
        className="absolute bottom-6 right-6 group h-12 w-12 rounded-full bg-gradient-to-tr from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 shadow-[0_8px_30px_rgb(245,158,11,0.2)] hover:shadow-[0_8px_30px_rgb(245,158,11,0.4)] backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300"
      >
        <AlertTriangle className="h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
        <span className="sr-only">Report an incident</span>
      </Button>
      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}