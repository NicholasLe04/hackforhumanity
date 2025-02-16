import { supabase } from "../../supabase/client";

export const checkAuthStatus = async () => {
  const { data } = await supabase.auth.getSession();
  return data?.session ? true : false;
};
