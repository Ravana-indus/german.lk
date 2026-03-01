import fetch, { FormData } from 'node-fetch';

async function testWorkerFormData() {
    console.log("Testing POST to worker with FormData...");
    let form = new FormData();
    form.append("first_name", "Test");
    form.append("last_name", "User");
    form.append("email", "test.formdata@worker.com");
    form.append("custom_cv", "dummy base64 or file data"); // just a string for now

    let res = await fetch("https://frappe-lead-worker.divine-cell-37a1.workers.dev", {
        method: "POST",
        body: form
    });
    console.log("FormData POST Status:", res.status);
    console.log("FormData POST Body:", await res.text());
}
testWorkerFormData();
