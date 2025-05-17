import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DateTime } from "https://esm.sh/luxon";
// ✅ Helper to return consistent JSON responses with CORS
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  });
}
serve(async (req)=>{
  // ✅ Handle preflight (CORS OPTIONS request)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }
  // ✅ Reject all non-POST methods
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Allow': 'POST, OPTIONS'
      }
    });
  }
  try {
    const body = await req.json();
    const { name, contact, notes, invited_by } = body;
    const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
    const fakeEmail = `survivor${crypto.randomUUID()}@ideyforyou.com`;
    const email = contact?.includes('@') ? contact : fakeEmail;
    // ✅ Create the user
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        name,
        notes,
        invited_by,
        role: 'survivor',
        contact: contact || null
      }
    });
    if (userError) return jsonResponse({
      error: userError.message
    }, 400);
    const user_id = userData.user.id;
    // ✅ Insert into Survivors table
    const { error: insertError } = await supabaseAdmin.from("Survivors").insert({
      id: user_id,
      name,
      notes,
      contact,
      invited_by,
      role: 'survivor',
      needs_link: false
    });
    if (insertError) return jsonResponse({
      error: insertError.message
    }, 500);
    // ✅ Check if current time is within 9AM–5PM Chicago
    const now = DateTime.now().setZone("America/Chicago");
    const isWithinBusinessHours = now.hour >= 9 && now.hour < 17;
    if (!isWithinBusinessHours) {
      await supabaseAdmin.from("Survivors").update({
        needs_link: true
      }).eq("id", user_id);
      return jsonResponse({
        message: "User created. Login link will be generated later during business hours."
      });
    }
    // ✅ Generate login link immediately
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email
    });
    if (linkError) return jsonResponse({
      error: linkError.message
    }, 400);
    // ✅ Send invite email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`
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
      return jsonResponse({
        error: resendError.message || 'Failed to send email'
      }, 500);
    }
    return jsonResponse({
      message: 'Check your email for survivor invite link'
    });
  } catch (err) {
    // console.error("Unexpected server error:", err);
    return jsonResponse({
      error: "Unexpected error. Please try again later."
    }, 500);
  }
});
