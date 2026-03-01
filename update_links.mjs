import fs from 'fs';
import path from 'path';

const files = [
    'index.html',
    'assessment/index.html',
    'ausbildung/index.html',
    'au-pair/index.html',
    'packages/index.html',
    'about/index.html',
    'study-in-germany/index.html',
    'contact/index.html',
    'apply/index.html',
    'chancenkarte/index.html'
];

for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace Free Assessment href="#" in nav
        content = content.replace(/<a href="#" class="btn-primary[^>]*>Free Assessment<\/a>/g, 
            '<a href="/assessment/" class="btn-primary !py-2.5 !px-5 !text-sm">Free Assessment</a>');
            
        // Replace Start Free Assessment href="#" in CTAs
        content = content.replace(/<a href="#" class="btn-primary[ \w!-]*"[^>]*>Start Free Assessment<\/a>/g, 
            '<a href="/assessment/" class="btn-primary w-full !text-sm">Start Free Assessment</a>');

        // Note: Start Free Assessment in large CTAs also has SVG inside it, handle that:
        content = content.replace(/<a href="#" class="btn-primary text-base px-8 py-4"[^>]*>([\s\S]*?)<\/a>/g,
            '<a href="/assessment/" class="btn-primary text-base px-8 py-4">$1</a>');

        // Replace any remaining href="#" that contains "Start Free Assessment"
        content = content.replace(/href="#"([^>]*>Start Free Assessment)/g, 'href="/assessment/"$1');
        
        // Footer "Free Assessment"
        content = content.replace(/<a href="#"[^>]*>Free Assessment<\/a>/g, 
            '<a href="/assessment/" class="btn-primary !py-2.5 !px-5 !text-sm mb-4">Free Assessment</a>');

        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    }
}
