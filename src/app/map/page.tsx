"use client";

import { useState, useEffect } from "react";
import Map from "@/components/map_component";
import Sidebar from "@/components/sidebar";
import PostModal from "@/components/post-modal";
import { supabase } from "@/supabase/client"
import { Post } from "@/supabase/schema"

export default function MapPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

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
      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}