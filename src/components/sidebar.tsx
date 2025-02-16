"use client";

import { useState, useEffect } from "react";
import { Search, Menu, X, LogOut, AlertTriangle } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useAuthContext } from "@/context/AuthContext";
import signInWithGoogle from "@/supabase/auth/signIn";
import signOut from "@/supabase/auth/signOut";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Post } from "@/supabase/schema";

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  posts: Post[];
  onIncidentClick?: (latitude: number, longitude: number) => void;
}

export default function Sidebar({
  isExpanded,
  setIsExpanded,
  posts,
  onIncidentClick,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts); // Initialize with all posts
  const { user } = useAuthContext() as { user: User | null };

  useEffect(() => {
    // Filter posts whenever searchQuery or posts changes
    const newFilteredPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(newFilteredPosts);
  }, [searchQuery, posts]);

  return (
    <div
      className={`fixed top-0 left-0 h-screen p-4 flex flex-col gap-4 transition-all duration-500 ease-in-out ${
        isExpanded ? "w-72" : "w-20"
      }`}
    >
      {/* SIDEBAR */}
      <div
        className={`bg-white rounded-2xl shadow-lg border border-gray-200/20 p-4 flex-1 transition-all duration-500 ease-in-out ${
          !isExpanded ? "items-center" : ""
        }`}
      >
        <div
          className={`flex items-center h-auto justify-between ${
            isExpanded ? "mb-6" : "mb-0 flex-col gap-4"
          }`}
        >
          {isExpanded ? (
            <Link href="/" className="flex items-center justify-center group">
              <AlertTriangle className="h-6 w-6 text-red-600 group-hover:text-red-700 transition-colors" />
              <span className="ml-2 text-2xl font-bold text-black">
                <span className="relative">
                  lmk
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 group-hover:bg-red-700 transform -rotate-2 transition-colors"></span>
                </span>
              </span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center justify-center group">
              <AlertTriangle className="h-6 w-6 text-red-600 group-hover:text-red-700 transition-colors" />
            </Link>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 border-black border-2 text-black rounded-xl transition-colors"
          >
            {isExpanded ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isExpanded && (
          <>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 pr-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/50 text-black"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Incidents
              </h2>
              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 rounded-xl bg-gray-50 hover:bg-white transition-colors border border-gray-200/10 shadow-sm cursor-pointer"
                    onClick={() => onIncidentClick?.(post.latitude, post.longitude)}
                  >
                    <p className="text-gray-900">{post.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* user profile section */}
      <div
        className={`bg-white rounded-2xl shadow-lg border border-gray-200/20 p-4 transition-all duration-500 ease-in-out ${
          !isExpanded ? "items-center" : ""
        }`}
      >
        {user ? (
          <div className={`flex items-center ${isExpanded ? "space-x-3" : ""}`}>
            <div className="flex-shrink-0">
              <Avatar
                className={`transition-all duration-500 ${
                  !isExpanded ? "h-10 w-10" : ""
                }`}
              >
                <AvatarImage src={user.user_metadata.avatar_url} />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            {isExpanded && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.user_metadata.full_name || user.email}
                </p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            )}
            {isExpanded && (
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={18} />
              </Button>
            )}
          </div>
        ) : (
          isExpanded ? (
            <Button
              onClick={signInWithGoogle}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
            >
              Sign In with Google
            </Button>
          ) : (
            <Button
              onClick={signInWithGoogle}
              className="w-5 h-5 p-0 rounded-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <AlertTriangle className="h-5 w-5" />
            </Button>
          )
        )}
      </div>
    </div>
  );
}
