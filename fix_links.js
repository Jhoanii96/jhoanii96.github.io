const fs = require('fs');

const path = 'assets/js/projects.js';
let content = fs.readFileSync(path, 'utf8');

const target = 'projectDialogLinks.innerHTML = project.links.map';
const replacement = 'projectDialogLinks.innerHTML = (project.links || []).map';

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(path, content, 'utf8');
    console.log('REPLACED_OK');
} else {
    console.log('TARGET_NOT_FOUND');
}

