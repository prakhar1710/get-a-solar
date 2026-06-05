## Add "Sign in with Google" to Login screen

### What I'll build
A polished Google sign-in button on the Login page that triggers Supabase OAuth and redirects users to the right dashboard after authentication.

### Changes

**1. `src/pages/LoginPage.tsx`**
- Add `handleGoogleSignIn` handler that calls:
  ```ts
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/login` }
  })
  ```
- Add a Google button above the email/password form on **both** Login and Sign Up tabs:
  - White background, subtle border, official multi-color Google "G" SVG icon, "Continue with Google" label
  - Full-width, matches existing button sizing, hover state via design tokens
  - Loading state while redirecting
- Add an "OR" divider between the Google button and the email form
- Extend the existing `useEffect` (which already handles `access_token`/`refresh_token` from URL) so that after a Google redirect it also reads the user's profile and routes to `/vendor` or `/customer`. New Google users (no profile row yet) → route to `/customer` by default (the `handle_new_user_profile` trigger requires `user_type`, so new OAuth users will need a profile completion step — see note below).

### Note on new Google users
Your `handle_new_user_profile` DB trigger **requires** `user_type` in user metadata and will reject signups without it. Google OAuth doesn't pass `user_type`, so first-time Google sign-ups will fail at the trigger.

Two options — please pick one before I implement:
- **A. Default new Google users to `customer`** — change the trigger to default `user_type` to `'customer'` when missing. Simplest; vendors would have to sign up via email.
- **B. Post-OAuth profile setup** — let signup succeed without `user_type`, then show the existing `ProfileSetupDialog` on first login to collect type/phone/pincode.

If you just want the button working for **existing** users right now, I can ship the UI as described and we can address new-user handling next.

### Supabase dashboard (already done by you, just confirming)
- Google provider enabled
- Authorized redirect URL includes `https://get-a-solar.lovable.app/login` (and preview URL)
