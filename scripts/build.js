import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import esbuild from 'esbuild';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const repoUrl = 'https://github.com/Autapomorph/userscripts';
const author = typeof pkg.author === 'string' ? pkg.author.split(' ')[0] : 'Autapomorph';

const isWatch = process.argv.includes('--watch');

function buildAll() {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const files = fs.readdirSync(srcDir);
  const userScripts = files.filter(
    file => file.endsWith('.ts') && !file.endsWith('.test.ts') && !file.endsWith('.d.ts'),
  );

  let hasError = false;

  userScripts.forEach(file => {
    const filePath = path.join(srcDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Extract Userscript header
    const headerMatch = fileContent.match(/\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==/);
    if (!headerMatch) {
      return;
    }

    let header = headerMatch[0];
    const baseName = file.replace(/\.user\.ts$/, '').replace(/\.ts$/, '');
    const outFileName = `${baseName}.user.js`;
    const distFilePath = path.join(distDir, outFileName);

    const downloadUrl = `${repoUrl}/releases/latest/download/${outFileName}`;

    const setOrReplaceHeaderTag = (tag, value) => {
      const tagRegex = new RegExp(`^//\\s*${tag}\\s+.*$`, 'm');
      if (tagRegex.test(header)) {
        header = header.replace(tagRegex, `// ${tag} ${value}`);
      } else {
        header = header.replace(
          /\/\/\s*==\/UserScript==/,
          `// ${tag} ${value}\n// ==/UserScript==`,
        );
      }
    };

    setOrReplaceHeaderTag('@namespace', repoUrl);
    setOrReplaceHeaderTag('@author', author);
    setOrReplaceHeaderTag('@downloadURL', downloadUrl);
    setOrReplaceHeaderTag('@updateURL', downloadUrl);
    setOrReplaceHeaderTag('@supportURL', `${repoUrl}/discussions`);
    setOrReplaceHeaderTag('@license', 'MIT');

    try {
      const result = esbuild.buildSync({
        entryPoints: [filePath],
        bundle: true,
        format: 'iife',
        target: 'es2022',
        write: false,
        minify: false,
      });

      const compiledCode = result.outputFiles[0].text;
      const finalContent = `${header}\n\n${compiledCode}`;
      fs.writeFileSync(distFilePath, finalContent, 'utf8');
      console.log(`[${new Date().toLocaleTimeString()}] Built: ${outFileName}`);
    } catch (err) {
      console.error(`Failed to build ${file}:`, err);
      hasError = true;
    }
  });

  return !hasError;
}

if (isWatch) {
  console.log('Starting build in watch mode...');
  buildAll();

  fs.watch(srcDir, (eventType, filename) => {
    if (filename && filename.endsWith('.ts') && !filename.endsWith('.test.ts')) {
      console.log(`File change detected in ${filename}, rebuilding...`);
      buildAll();
    }
  });
} else {
  console.log('Building userscripts...');
  const success = buildAll();
  if (!success) {
    process.exit(1);
  }
}
