import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// TikTok Pixel and Token Configuration
const TIKTOK_ACCESS_TOKEN = "8320314aca74fa6f23433c25b63eb5a656eb76a8";
const TIKTOK_PIXEL_CODE = "D6I604RC77U12IB43AFG";
const TIKTOK_EVENTS_API_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// High quality SHA256 Hash for TikTok Email/Phone
async function sha256(message: string): Promise<string> {
    if (!message) return "";
    const msgBuffer = new TextEncoder().encode(message.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

Deno.serve(async (req: Request) => {
    // 1. Handle CORS Preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const payload = await req.json();
        const { event_name, event_id, event_time, user_data, url } = payload;

        if (!event_name) {
            return new Response(JSON.stringify({ error: "Missing event_name" }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            });
        }

        // 2. Hash User Data (TikTok requires SHA256 hashed emails/phones)
        const hashedEmail = user_data?.email ? await sha256(user_data.email) : undefined;
        // Phone numbers must be hashed and ideally include the country code
        let phoneStr = user_data?.phone ? String(user_data.phone).replace(/\D/g, '') : "";
        if (phoneStr && phoneStr.startsWith('0')) {
            phoneStr = '94' + phoneStr.slice(1); // Assuming Sri Lankan based on project context
        }
        const hashedPhone = phoneStr ? await sha256(phoneStr) : undefined;

        // 3. Construct TikTok Payload
        const tikTokEventData = {
            pixel_code: TIKTOK_PIXEL_CODE,
            events: [
                {
                    event: event_name, // e.g. "CompleteRegistration", "InitiateCheckout"
                    event_id: event_id || crypto.randomUUID(),
                    event_time: event_time || Math.floor(Date.now() / 1000),
                    page_url: url || req.headers.get("referer") || "",
                    user: {
                        email: hashedEmail,
                        phone_number: hashedPhone,
                        client_ip_address: req.headers.get('x-forwarded-for') || undefined,
                        client_user_agent: req.headers.get('user-agent') || undefined,
                    }
                }
            ]
        };

        // 4. Send to TikTok Events API
        const tiktokResponse = await fetch(TIKTOK_EVENTS_API_URL, {
            method: 'POST',
            headers: {
                'Access-Token': TIKTOK_ACCESS_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tikTokEventData)
        });

        if (!tiktokResponse.ok) {
            const errorText = await tiktokResponse.text();
            throw new Error(`TikTok API error: ${tiktokResponse.status} - ${errorText}`);
        }

        const tikTokData = await tiktokResponse.json();

        // Check if TikTok returned success in its custom payload format
        if (tikTokData.code !== 0) {
            console.error("TikTok Event API Failure:", tikTokData);
            throw new Error(`TikTok API failed with code ${tikTokData.code}: ${tikTokData.message}`);
        }

        return new Response(JSON.stringify({ success: true, message: "Event dispatched to TikTok", data: tikTokData }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error) {
        console.error("TikTok Edge Trigger Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
        });
    }
});
