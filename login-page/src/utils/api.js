// Centralized URLs so production never falls back to localhost
export function getBackendUrl() {
  const env = process.env.REACT_APP_BACKEND_URL;
  if (env && env.trim()) return env.trim();

  if (typeof window !== 'undefined') {
    const host = window.location.hostname || '';
    // On Vercel deploys (preview or prod), default to Render backend
    if (host.endsWith('.vercel.app')) {
      return 'https://pothole-detection-backend.onrender.com';
    }
  }

  // Local development fallback
  return 'http://localhost:5001';
}

export function getAiServiceUrl() {
  const env = process.env.REACT_APP_AI_SERVICE_URL;
  if (env && env.trim()) return env.trim();
  // Default to Heroku AI service in production
  return 'https://pothole-detection-ai-4562ae5b30dc.herokuapp.com';
}
