import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { DEFAULT_CONTENT } from './src/content/defaults';
import { businessJsonLd, jsonForScript } from './src/seo';

/**
 * Fills index.html at build time: search-engine data from the built-in
 * content, and a Content-Security-Policy that only allows the services the
 * site actually uses. GitHub Pages cannot send headers, so the policy is a
 * meta tag. It is left out in dev, where Vite needs inline scripts.
 */
function htmlPlugin(env: Record<string, string>, isBuild: boolean): Plugin {
  const emulators = env.VITE_FIREBASE_EMULATORS === '1';
  const authDomain = env.VITE_FIREBASE_AUTH_DOMAIN ? `https://${env.VITE_FIREBASE_AUTH_DOMAIN}` : '';
  const local = emulators ? ' http://127.0.0.1:8080 http://127.0.0.1:9099' : '';
  const csp = [
    "default-src 'self'",
    "script-src 'self' https://apis.google.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    `connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://content-firebaseappcheck.googleapis.com https://www.google.com/recaptcha/${local}`,
    `frame-src https://maps.google.com https://www.google.com ${authDomain}`.trim(),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  return {
    name: 'cafe-html',
    transformIndexHtml(html) {
      return html
        .replace('__BUSINESS_DATA__', jsonForScript(businessJsonLd(DEFAULT_CONTENT)))
        .replace('<!--CSP-->', isBuild ? `<meta http-equiv="Content-Security-Policy" content="${csp}" />` : '');
    },
  };
}

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, '.', 'VITE_');
  return {
    base: '/057Cafe/',
    plugins: [react(), tailwindcss(), htmlPlugin(env, command === 'build')],
  };
});
