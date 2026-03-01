import fs from 'fs';
import path from 'path';

const files = [
    'index.html',
    'chancenkarte/index.html',
    'packages/index.html'
];

for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // index.html specific
        content = content.replace(/href="#"([^>]*>\s*<svg[^>]*>[\s\S]*?<\/svg>\s*Start Your Free Assessment)/g, 'href="/assessment/"$1');
        content = content.replace(/href="#"([^>]*>\s*<svg[^>]*>[\s\S]*?<\/svg>\s*Talk to an Expert)/g, 'href="/contact/"$1');
        content = content.replace(/href="#"([^>]*>\s*<svg[^>]*>[\s\S]*?<\/svg>\s*View Packages)/g, 'href="/packages/"$1');
        
        // chancenkarte specific
        content = content.replace(/href="#"([^>]*>Check Chancenkarte Eligibility)/g, 'href="/assessment/"$1');

        // packages specific
        content = content.replace(/href="#"([^>]*>Choose DIY)/g, 'href="/contact/"$1');
        content = content.replace(/href="#"([^>]*>Choose Plus)/g, 'href="/contact/"$1');
        content = content.replace(/href="#"([^>]*>Go PRO)/g, 'href="/contact/"$1');

        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    }
}
