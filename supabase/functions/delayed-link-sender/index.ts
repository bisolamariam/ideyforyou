import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: survivors, error: fetchError } = await supabase
    .from("Survivors")
    .select("id, contact")
    .eq("needs_link", true);

  if (fetchError) {
    return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 });
  }

  const results = [];

  for (const survivor of survivors) {
    const { id, contact } = survivor;

    // Get user to ensure we have the right email (fake or real)
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(id);
    if (userError || !user) {
      results.push({ id, error: userError?.message || 'User not found' });
      continue;
    }

    const email = user.user?.email;
    if (!email) {
      results.push({ id, error: 'Missing email' });
      continue;
    }

    // Generate magic link
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email
    });

    if (linkError) {
      results.push({ id, error: linkError.message });
      continue;
    }

    // Update Survivor to mark as complete
    await supabase.from("Survivors").update({
      needs_link: false,
    //   last_login_link_sent_at: new Date().toISOString()
    }).eq("id", id);

    results.push({ id, link: linkData.properties?.action_link, invited_by: survivor.invited_by });
  }

  return new Response(JSON.stringify({ status: "completed", results }), { status: 200 });
});
