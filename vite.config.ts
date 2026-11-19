import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { twTokens } from './scripts/tw-tokens.ts';
import { seo } from './scripts/seo.ts';

/**
 * `pnpm dev` only: serves the Vercel Functions in api/ (Web-standard `export function POST(request)` handlers)
 * so the demo request form works locally. Their env (RESEND_API_KEY, ...) comes from .env / .env.local;
 * INQUIRY_MAIL_TO_DEV, when set, replaces INQUIRY_MAIL_TO so test requests don't reach the real inbox.
 */
function apiDev(): Plugin {
  return {
    name: 'api-dev',
    apply: 'serve',
    configureServer(server) {
      // .env wins over what this process already holds: the server restarts in place (an edit to this config or
      // the dictionaries it imports), and an earlier .env's values would otherwise stick until it is killed
      Object.assign(process.env, loadEnv(server.config.mode, server.config.root, ''));
      if (process.env.INQUIRY_MAIL_TO_DEV) process.env.INQUIRY_MAIL_TO = process.env.INQUIRY_MAIL_TO_DEV;
      server.middlewares.use('/api', async (req, res, next) => {
        const name = (req.url ?? '').split('?')[0].replace(/^\/+|\/+$/g, '');
        if (!/^[\w-]+$/.test(name)) return next();
        try {
          const module = await server.ssrLoadModule(`/api/${name}.ts`);
          const handler = module[req.method ?? 'GET'] as ((request: Request) => Promise<Response>) | undefined;
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const request = new Request(new URL(req.originalUrl ?? req.url ?? '/', 'http://localhost'), {
            method: req.method,
            headers: { 'content-type': req.headers['content-type'] ?? '' },
            body: chunks.length ? Buffer.concat(chunks) : undefined
          });
          const response = handler ? await handler(request) : new Response(null, { status: 405 });
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
          next(error);
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), twTokens(), seo(), apiDev()],
  server: { port: 5174 },
  preview: { port: 4174 }
});
