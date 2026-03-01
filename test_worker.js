const fs = require('fs');

async function testWorker() {
    console.log("Testing POST to worker base...");
    let res = await fetch("https://frappe-lead-worker.divine-cell-37a1.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: "Test", email: "test.file@worker.com" })
    });
    console.log("Base POST Status:", res.status);
    console.log("Base POST Body:", await res.text());

    console.log("Testing POST to worker upload_file...");
    res = await fetch("https://frappe-lead-worker.divine-cell-37a1.workers.dev/api/method/upload_file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    });
    console.log("Upload POST Status:", res.status);
    console.log("Upload POST Body:", await res.text());
}
testWorker();
