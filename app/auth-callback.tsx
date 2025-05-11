import { useEffect } from 'react';
import { supabase } from '../lib/supabase'; 
import { router } from 'expo-router';

export default function AuthCallback() {
  useEffect(() => {
    // Supabase handles the session automatically on link open.
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Redirect to home or wherever
        router.replace('/');
      } else {
        // Optional: show error or retry
        console.log('No session found');
      }
    };

    checkUser();
  }, []);

  return null; // or a loading indicator
}
