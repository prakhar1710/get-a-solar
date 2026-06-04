## Problem

On `LoginPage.tsx`, the "Forgot password?" link is just `<a href="#">` — it doesn't do anything. There's also no `/reset-password` route, so even if we triggered Supabase's reset email, the user would have nowhere to land and set a new password.

## Plan

1. **Add a "Forgot Password" dialog** triggered from the login form
   - Replace the `href="#"` link with a button that opens a dialog
   - Dialog contains an email input + "Send reset link" button
   - Calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: \`${window.location.origin}/reset-password\` })`
   - Shows confirmation toast / "check your email" state

2. **Create `/reset-password` page** (`src/pages/ResetPasswordPage.tsx`)
   - Public route (no auth guard)
   - On mount, Supabase auto-creates a recovery session from the URL hash (`type=recovery`)
   - Form with new password + confirm password fields
   - Calls `supabase.auth.updateUser({ password })`
   - On success: toast + redirect to `/login`
   - Handles invalid/expired link errors

3. **Register the route** in `src/App.tsx` as a public route

4. **Supabase redirect URLs** — tell the user to add `https://<their-domain>/reset-password` (preview, published, and any custom domain) to Supabase Auth → URL Configuration → Redirect URLs, otherwise the reset link will bounce back to the site URL.

### Technical notes

- Use existing `Dialog` shadcn component for the forgot-password modal
- Use existing `MainLayout` + `SEOHead` for the reset-password page for consistency
- No DB / RLS / edge function changes needed
- Default Supabase recovery email template is sufficient; no need to scaffold custom auth email templates unless you also want branded emails (separate task)
