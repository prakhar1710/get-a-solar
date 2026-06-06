import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

/**
 * Catches Supabase OAuth tokens that may arrive on any route after
 * a Google redirect (e.g. when hosting providers rewrite the path).
 *
 * Handles both:
 *  - Hash-style:   /#access_token=...&refresh_token=...
 *  - Query-style:  /?code=... (PKCE) or /?access_token=...
 *
 * Once a session is established it forwards the user to /login,
 * where the existing post-auth routing decides /customer vs /vendor.
 */
const OAuthRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    const hasHashToken = hash.includes('access_token=') || hash.includes('refresh_token=');
    const hasCode = new URLSearchParams(search).has('code');

    if (!hasHashToken && !hasCode) return;
    // Already on /login — let LoginPage's own handler take over.
    if (location.pathname === '/login') return;

    (async () => {
      try {
        if (hasCode) {
          await supabase.auth.exchangeCodeForSession(window.location.href);
        } else {
          // supabase-js auto-parses the hash on load; just wait for it.
          await supabase.auth.getSession();
        }
      } catch (err) {
        console.error('OAuth token handling error:', err);
      } finally {
        // Clean URL and hand off to LoginPage for dashboard routing.
        window.history.replaceState({}, document.title, '/login');
        navigate('/login', { replace: true });
      }
    })();
  }, [location.pathname, navigate]);

  return null;
};

export default OAuthRedirectHandler;
