async function testWorker() {
    const URL = "https://frappe-lead-worker.divine-cell-37a1.workers.dev";
    
    // Payload from contact page
    const payloadContact = {
        first_name: "Test",
        last_name: "User",
        email_id: "test@example.com",
        mobile_no: "+94771234567",
        custom_pathway: "Student",
        title: "WhatsApp Lead: Test - Student",
        status: 'Lead',
        custom_source_url: "http://localhost:5173/contact/",
        custom_lead_source: 'WhatsApp Button',
        custom_do_you_have_a_degree: "Yes",
        custom_do_you_have_3_passes_in_a_level_in_one_sitting: "Yes",
        custom_do_you_have_a_gpa_of_28_or_above_or_second_class_upper: "Yes",
        custom_do_you_have_german_language: "Yes",
        custom_do_you_have_ielts_60_or_above__can_archive_60: "No",
        custom_funding_capacity: "LKR 1.5M - 2.5M"
    };

    console.log("Testing Contact Payload...");
    let res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payloadContact)
    });
    console.log("Contact HTTP Status:", res.status);
    console.log("Contact Response:", await res.text());

    // Payload with email instead of email_id
    const payloadApply = { ...payloadContact, email: "test2@example.com" };
    delete payloadApply.email_id;

    console.log("\nTesting Apply Payload (with 'email')...");
    let res2 = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payloadApply)
    });
    console.log("Apply HTTP Status:", res2.status);
    console.log("Apply Response:", await res2.text());
}
testWorker();
