import { supabase } from "../client";

// Function to sign in with email and password
export default async function signOut() {
    let result = null;
    let error = null;

    try {
        result = await supabase.auth.signOut();
    } catch (e) {
        error = e;
    }
    return { result, error };
}