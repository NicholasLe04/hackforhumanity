'use client'
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/supabase/client";

const AuthContext = createContext({});

const useAuthContext = () => useContext(AuthContext);

function AuthContextProvider({ children }: { children: ReactNode }) {
    const [ user, setUser ] = useState<User | undefined>();

    useEffect(() => {
        // Subscribe to the authentication state changes
        supabase.auth.onAuthStateChange((_, session) => {
            if (session?.user) {
            // User is signed in
            setUser(session?.user);
          } else {
            // User is signed out
            setUser(undefined);
          }
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
          {children}
        </AuthContext.Provider>
    )
}

export { AuthContextProvider, useAuthContext, AuthContext }