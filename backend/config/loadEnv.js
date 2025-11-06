// Centralized env loader: only load .env for local/dev. Avoid loading in hosted environments.
(() => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isRender = process.env.RENDER === 'true' || process.env.RENDER === '1';
  const isVercel = !!process.env.VERCEL;
  const isHeroku = !!process.env.DYNO;

  if (!isProduction && !isRender && !isVercel && !isHeroku) {
    try {
      require('dotenv').config();
      // eslint-disable-next-line no-console
      console.log('[env] Loaded .env for local development');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[env] dotenv not available or .env not found; skipping');
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('[env] Skipping .env load in production/hosted environment');
  }
})();

module.exports = {};
