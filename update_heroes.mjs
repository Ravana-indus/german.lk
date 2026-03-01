import fs from 'fs';
import path from 'path';

const files = [
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
        // Replace the src attribute of the img that has class 'page-hero-img'
        // Regex looks for <img ... src="..." ... class="page-hero-img"
        content = content.replace(/(<img[^>]*src=")[^"]+("[^>]*class="page-hero-img")/g, '$1/inner-hero-bg.webp$2');
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    } else {
        console.log(`File not found: ${file}`);
    }
}
