"use client";

import { useState } from "react";
import { Search, Menu, X, LogOut } from "lucide-react";
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
}

export default function Sidebar({ isExpanded, setIsExpanded, posts }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuthContext() as { user: User | null };

  return (
    <div
      className={`bg-gray-100 text-black flex flex-col transition-all duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between p-4">
        {isExpanded && (
          <Link className="text-xl font-bold" href="/">
            LET ME KNOW
          </Link>
        )}
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isExpanded && (
        <div className="flex-1 p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>

          {/* POSTS ARE DISPLAYED HERE!!!!!! */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Recent Incidents</h2>
            <ul>
              {posts.map((post) => (
                <li key={post.id} className="py-2 border-b border-gray-300">
                  {post.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="mt-auto p-4">
        {user ? (
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={user.user_metadata.avatar_url} />
              <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            {isExpanded && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.user_metadata.full_name || user.email}
                </p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            )}
            {isExpanded && (
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut size={18} />
              </Button>
            )}
          </div>
        ) : (
          isExpanded && (
            <Button onClick={signInWithGoogle} className="w-full">
              Sign In
            </Button>
          )
        )}
      </div>
    </div>
  );
}
