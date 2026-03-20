import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import jwt from "npm:jsonwebtoken@9.0.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function generateToken(identity: string): string {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const apiKey = Deno.env.get("TWILIO_API_KEY");
  const apiSecret = Deno.env.get("TWILIO_API_SECRET");
  const twimlAppSid = Deno.env.get("TWILIO_TWIML_APP_SID");

  if (!accountSid || !apiKey || !apiSecret || !twimlAppSid) {
    throw new Error("Missing Twilio credentials");
  }

  const now = Math.floor(Date.now() / 1000);
  const exp = now + 3600;

  const grants = {
    identity: identity,
    voice: {
      outgoing: {
        application_sid: twimlAppSid,
      },
      incoming: {
        allow: true,
      },
    },
  };

  const payload = {
    jti: `${apiKey}-${now}`,
    iss: apiKey,
    sub: accountSid,
    exp: exp,
    grants: grants,
  };

  const token = jwt.sign(payload, apiSecret, { algorithm: "HS256" });
  return token;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { identity } = await req.json();
    const userIdentity = identity || `user_${Date.now()}`;

    const token = generateToken(userIdentity);

    return new Response(
      JSON.stringify({ token, identity: userIdentity }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error generating token:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to generate token"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
