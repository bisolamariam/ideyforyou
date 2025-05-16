import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
  const { email } = await req.json();

  const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return new Response(JSON.stringify({ exists: true }), { status: 200 });
  }

  return new Response(JSON.stringify({ exists: false }), { status: 200 });
});