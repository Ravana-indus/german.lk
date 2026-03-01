import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SMS_CREDENTIALS = {
    username: 'pathu122',
    password: 'Thenewpass1!',
    login_url: 'https://e-sms.dialog.lk/api/v1/login',
    sms_url: 'https://e-sms.dialog.lk/api/v2/sms'
};

const WELCOME_MESSAGE = "Welcome to German.lk, You will be contacted by our representative soon, if you need urgent assistance please call 0112 581 181";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function formatSriLankanNumber(number: string) {
    if (!number) return null;
    let cleanNumber = number.toString().replace(/\D/g, '');
    if (cleanNumber.startsWith('0094')) cleanNumber = '0' + cleanNumber.slice(4);
    else if (cleanNumber.startsWith('94')) cleanNumber = '0' + cleanNumber.slice(2);
    if (cleanNumber.length === 9 && /^[7]/.test(cleanNumber)) {
        cleanNumber = '0' + cleanNumber;
    }
    return cleanNumber.length === 10 ? cleanNumber : null;
}

function isValidSriLankanNumber(number: string) {
    if (!number || number.length !== 10) return false;
    const validPrefixes = ['070', '071', '072', '074', '075', '076', '077', '078'];
    return validPrefixes.some(prefix => number.startsWith(prefix));
}

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const payload = await req.json();
        const { mobile_number } = payload;

        if (!mobile_number) {
            return new Response(JSON.stringify({ error: "No mobile_number provided" }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            });
        }

        const formattedNumber = formatSriLankanNumber(mobile_number);

        if (!formattedNumber || !isValidSriLankanNumber(formattedNumber)) {
            // Not a valid SL number, do not send SMS, but return success to not block frontend
            return new Response(JSON.stringify({ success: true, message: "Not a valid Sri Lankan number. Skipped SMS." }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            });
        }

        // 1. Get Access Token
        const loginResponse = await fetch(SMS_CREDENTIALS.login_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: SMS_CREDENTIALS.username,
                password: SMS_CREDENTIALS.password
            })
        });

        if (!loginResponse.ok) {
            throw new Error(`Login HTTP error! status: ${loginResponse.status}`);
        }

        const loginData = await loginResponse.json();

        if (loginData.status !== 'success' || !loginData.token) {
            throw new Error(loginData.comment || 'Authentication failed');
        }

        const token = loginData.token;

        // 2. Send SMS
        const smsResponse = await fetch(SMS_CREDENTIALS.sms_url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                msisdn: [{ mobile: formattedNumber }],
                message: WELCOME_MESSAGE,
                transaction_id: String(Date.now()),
                payment_method: 0
            })
        });

        if (!smsResponse.ok) {
            throw new Error(`SMS HTTP error! status: ${smsResponse.status}`);
        }

        const smsData = await smsResponse.json();

        if (smsData.status !== 'success') {
            throw new Error(smsData.comment || 'SMS sending failed');
        }

        return new Response(JSON.stringify({ success: true, message: "Welcome SMS sent successfully." }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
        });
    }
});
