import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(projectDir, 'dist');

await rm(distDir, { recursive: true, force: true });
await mkdir(join(distDir, 'server'), { recursive: true });
await mkdir(join(distDir, '.openai'), { recursive: true });

await cp(join(projectDir, 'index.html'), join(distDir, 'index.html'));
await cp(join(projectDir, 'css'), join(distDir, 'css'), { recursive: true });
await cp(join(projectDir, 'js'), join(distDir, 'js'), { recursive: true });
await cp(join(projectDir, 'assets'), join(distDir, 'assets'), { recursive: true });
await cp(join(projectDir, '.openai', 'hosting.json'), join(distDir, '.openai', 'hosting.json'));
await writeFile(join(distDir, '.nojekyll'), '');

const worker = `export default {
  async fetch(request, env) {
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }
    return new Response('Static asset binding unavailable', { status: 503 });
  }
};\n`;

await writeFile(join(distDir, 'server', 'index.js'), worker);
console.log('Built static portfolio in dist/');
