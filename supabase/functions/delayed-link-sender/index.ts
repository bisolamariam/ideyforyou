import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

serve(async () => {
  // console.log("delayed-link-sender triggered at", new Date().toISOString());

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: survivors, error: fetchError } = await supabase
    .from("Survivors")
    .select("id, contact")
    .eq("needs_link", true);

  if (fetchError) {
    // console.error("Error fetching survivors:", fetchError.message);
    return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 });
  }

  const results = [];

  for (const survivor of survivors) {
    const { id, name, invited_by } = survivor;

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

    const loginLink = linkData.properties?.action_link;

    // Send the link to the DSP (invited_by)
    if (invited_by) {
      await resend.emails.send({
        from: "hello@ideyforyou.com",
        to: invited_by,
        subject: "Survivor Login Link",
        html: `
          <p>Hello,</p>
          <p>The login link for ${name} is ready:</p>
          <p><a href="${loginLink}">${loginLink}</a></p>
          <p>This link will expire soon. Please share it securely with the survivor.</p>
          <p>— The ideyforyou Team</p>
        `,
      });
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
