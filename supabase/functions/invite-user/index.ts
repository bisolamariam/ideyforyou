import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DateTime } from "https://esm.sh/luxon@3.4.3";

serve(async (req) => {
  const body = await req.json();
  const { name, contact, notes, invited_by } = body;

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Prepare email (or generate fake one if not provided)
  const fakeEmail = `survivor${crypto.randomUUID()}@ideyforyou.com`;
  const email = contact?.includes('@') ? contact : fakeEmail;

  // Create user with metadata
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      name,
      notes,
      invited_by,
      role: 'survivor',
      contact: contact || null
    },
  });

  if (userError) {
    return new Response(JSON.stringify({ error: userError.message }), { status: 400 });
  }

  const user_id = userData.user.id;

  //Store user in Survivors table 
  const { error: insertError } = await supabaseAdmin.from("Survivors").insert({
    id: user_id,
    name,
    notes,
    contact,
    invited_by,
    role: 'survivor',
    needs_link: false, // default to false
  });

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
  }

  // Check Chicago time
  const now = DateTime.now().setZone("America/Chicago");
  const isWithinBusinessHours = now.hour >= 9 && now.hour < 17;

  if (!isWithinBusinessHours) {
    // Mark for link generation later
    await supabaseAdmin.from("Survivors").update({ needs_link: true }).eq("id", user_id);

    return new Response(JSON.stringify({ message: "User created. Login link will be generated later during business hours." }), { status: 200 });
  }

  // Generate link now
  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });

  if (linkError) {
    return new Response(JSON.stringify({ error: linkError.message }), { status: 400 });
  }

  // Send email using Resend
  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
    },
    body: JSON.stringify({
      from: "hello@ideyforyou.com",
      to: invited_by,
      subject: `Survivor Invitation Link`,
      html: `<p>A login link has been generated for ${name}:</p><p><a href="${linkData.properties?.action_link}">${linkData.properties?.action_link}</a></p>`
    })
  });

  if (!resendResponse.ok) {
    const resendError = await resendResponse.json();
    return new Response(JSON.stringify({ error: resendError.message || 'Failed to send email' }), { status: 500 });
  }

  return new Response(JSON.stringify({ link: linkData.properties?.action_link }), { status: 200 });
});


