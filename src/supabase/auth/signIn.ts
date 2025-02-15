import { supabase } from "../client";

// Function to sign in with email and password
export default async function signInWithGoogle() {
    let result = null;
    let error = null;

    try {
        result = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: "https://ryprhnikjykoacktfnkn.supabase.co/auth/v1/callback"
            }
        })
    } catch (e) {
        error = e;
    }
    return { result, error };
}