import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2];
const overridesRoot = process.argv[3];

if (!root || !overridesRoot) {
  throw new Error('Usage: node apply-branding.mjs <source-root> <overrides-root>');
}

const textExtensions = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.json', '.html', '.md', '.txt', '.xml', '.yml', '.yaml', '.css'
]);

const replacements = [
  [/https:\/\/github\.com\/iib0011\/omni-tools[^\s'"`<)]*/gi, 'https://github.com/sunzhiyouvv-tech/itjk-doc'],
  [/https:\/\/github\.com\/iib0011\/?/gi, 'https://github.com/sunzhiyouvv-tech'],
  [/https:\/\/discord\.gg\/SDbbn3hT4b/gi, 'https://doc.itjk.com'],
  [/https:\/\/drive\.google\.com\/file\/d\/1-r9-rDYnDJic9dnDywKTAsueehIAVp5F\/view\?usp=sharing/gi, 'https://doc.itjk.com'],
  [/ibracool99@gmail\.com/gi, ''],
  [/omnitools\.app/gi, 'doc.itjk.com'],
  [/OmniTools/g, 'ITJK 文档工具箱'],
  [/OMNITOOLS/g, 'ITJK'],
  [/omni-tools/g, 'itjk-doc'],
  [/omnitools/g, 'itjk-doc'],
  [/iib0011/g, 'sunzhiyouvv-tech']
];

function rewriteFile(file) {
  let content;
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch {
    return;
  }

  let next = content;
  for (const [pattern, replacement] of replacements) {
    next = next.replace(pattern, replacement);
  }

  if (next !== content) fs.writeFileSync(file, next);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'dist'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (textExtensions.has(path.extname(entry.name).toLowerCase())) {
      rewriteFile(full);
    }
  }
}

// Replace the entire upstream navbar so no upstream logo, version link,
// GitHub star widget, Discord link, or personal profile link is rendered.
fs.copyFileSync(
  path.join(overridesRoot, 'Navbar.tsx'),
  path.join(root, 'src/components/Navbar/index.tsx')
);

walk(root);

// Use Chinese by default while retaining the language switcher.
const i18nFile = path.join(root, 'src/i18n/index.ts');
let i18n = fs.readFileSync(i18nFile, 'utf8');
i18n = i18n.replace("fallbackLng: 'en'", "fallbackLng: 'zh'");
i18n = i18n.replace(
  '.init({',
  ".init({\n    lng: localStorage.getItem('lang') || 'zh',"
);
fs.writeFileSync(i18nFile, i18n);

// Clean page metadata and remove all original icon assets.
const indexFile = path.join(root, 'index.html');
let index = fs.readFileSync(indexFile, 'utf8');
index = index
  .replace('<html lang="en">', '<html lang="zh-CN">')
  .replace(/^\s*<link rel="icon"[^>]*>\s*$/gm, '')
  .replace(/^\s*<link rel="shortcut icon"[^>]*>\s*$/gm, '')
  .replace(/^\s*<link rel="apple-touch-icon"[^>]*>\s*$/gm, '')
  .replace(/<meta name="apple-mobile-web-app-title" content="[^"]*"\s*\/>/g, '<meta name="apple-mobile-web-app-title" content="ITJK 文档工具箱" />')
  .replace(/<title>[^<]*<\/title>/g, '<title>ITJK 文档工具箱</title>');
fs.writeFileSync(indexFile, index);

const manifestFile = path.join(root, 'public/site.webmanifest');
fs.writeFileSync(
  manifestFile,
  JSON.stringify(
    {
      name: 'ITJK 文档工具箱',
      short_name: 'ITJK',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#ffffff'
    },
    null,
    2
  ) + '\n'
);

for (const name of fs.readdirSync(path.join(root, 'public'))) {
  if (/^(favicon|apple-touch-icon|web-app-manifest)/i.test(name)) {
    fs.rmSync(path.join(root, 'public', name), { force: true, recursive: true });
  }
}

for (const logo of ['logo.png', 'logo-white.png']) {
  fs.rmSync(path.join(root, 'src/assets', logo), { force: true });
}

// Remove upstream project/profile metadata that is not needed to build the site.
for (const target of ['README.md', 'CODEOWNERS', '.github/FUNDING.yml']) {
  fs.rmSync(path.join(root, target), { force: true, recursive: true });
}
fs.rmSync(path.join(root, '.idea'), { force: true, recursive: true });

const packageFile = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
pkg.name = 'itjk-doc';
pkg.description = 'ITJK 文档工具箱';
pkg.author = { name: 'ITJK' };
delete pkg.bugs;
fs.writeFileSync(packageFile, JSON.stringify(pkg, null, 2) + '\n');

// Keep the required MIT notice without any upstream project link or branding.
fs.copyFileSync(
  path.join(overridesRoot, '..', 'THIRD_PARTY_NOTICES.txt'),
  path.join(root, 'public/THIRD_PARTY_NOTICES.txt')
);

console.log('[ITJK] Branding applied.');
