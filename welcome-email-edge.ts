import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import nodemailer from "npm:nodemailer@6.9.9";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// SMTP Configuration
const transporter = nodemailer.createTransport({
    host: "fusion.mxrouting.net",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "hello@german.lk",
        pass: "Thenewpass1!"
    }
});

Deno.serve(async (req: Request) => {
    // Handle CORS Preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const payload = await req.json();
        const { email, name, pathway } = payload;

        if (!email || !name) {
            return new Response(JSON.stringify({ error: "Missing required fields (email, name)" }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            });
        }

        const pathwayLabel = pathway ? `the ${pathway} pathway` : "studying in Germany";

        const mailOptions = {
            from: '"German.lk" <hello@german.lk>', // sender address
            to: email, // list of receivers
            subject: "Welcome to German.lk! Your Germany Journey Begins Here 🇩🇪", // Subject line
            text: `Hi ${name},\n\nThank you for applying with German.lk! We have received your profile for ${pathwayLabel}. Our consultants are reviewing your details and will contact you via WhatsApp or Email shortly.\n\nBest regards,\nThe German.lk Team\n0112 581 181`, // plain text body
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1a1a2e; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="color: #dd1c1a; margin-top: 0;">Welcome to German.lk! 🇩🇪</h2>
                <p>Hi <strong>${name}</strong>,</p>
                <p>Thank you for submitting your free assessment and application! We have successfully received your profile for <strong>${pathwayLabel}</strong>.</p>
                <p>Our expert consultants are currently reviewing your documents and eligibility. We will reach out to you directly via WhatsApp or Email shortly to discuss your best-fit pathway to Germany.</p>
                <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #c9a84c; margin: 24px 0;">
                    <p style="margin: 0; font-size: 0.95em;"><strong>Need urgent assistance?</strong></p>
                    <p style="margin: 4px 0 0 0; font-size: 0.9em; color: #475569;">Call us directly at <a href="tel:0112581181" style="color: #dd1c1a; text-decoration: none; font-weight: bold;">0112 581 181</a> or reply to this email.</p>
                </div>
                <p>We look forward to guiding you on this exciting journey.</p>
                <br>
                <p style="margin: 0;">Best regards,</p>
                <p style="margin: 4px 0 0 0; font-weight: bold;">The German.lk Team</p>
                <p style="margin: 0; font-size: 0.85em; color: #64748b;">Sri Lanka's premier Germany pathway consultant.</p>
            </div>
            ` // html body
        };

        // Send Email
        const info = await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ success: true, message: "Welcome email sent successfully!", messageId: info.messageId }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error) {
        console.error("Welcome Email Sending Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
        });
    }
});
