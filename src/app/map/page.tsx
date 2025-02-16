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
  const [selectedLocation, setSelectedLocation] = useState<[number, number]>([-121.93674821356363, 37.34927518611693]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  async function getSortedDistances(current_latitude: number, current_longitude: number) {
    // Step 1: Fetch the data from Supabase (without the complex distance expression)
    const { data, error } = await supabase.from('posts').select("*");

    if (error) {
      console.error('Error fetching data:', error);
      return null;
    }

    // Step 2: Calculate the distance in JavaScript for each row
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 3958.8; // Earth's radius in km
      const X = (lat1 * Math.PI) / 180;
      const Y = (lat2 * Math.PI) / 180;
      const Z = ((lat2 - lat1) * Math.PI) / 180;
      const W = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(Z / 2) * Math.sin(Z / 2) +
        Math.cos(X) * Math.cos(Y) * Math.sin(W / 2) * Math.sin(W / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c; // Distance in km
    };

    // Step 3: Add the calculated distance to each data object
    const dataWithDistances = data.map((row) => {
      const distance = calculateDistance(current_latitude, current_longitude, row.latitude, row.longitude);
      return { ...row, distance: distance };
    });

    // Step 4: Sort the data by distance
    dataWithDistances.sort((a, b) => a.distance - b.distance);

    // Return the sorted data with distances
    return dataWithDistances;
  }

  const handleIncidentClick = (latitude: number, longitude: number) => {
    setSelectedLocation([longitude, latitude]);
  };
  

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getSortedDistances(selectedLocation[1], selectedLocation[0]);

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