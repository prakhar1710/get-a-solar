# Get A Solar

India's solar bidding platform connecting homeowners with verified solar installation vendors. Customers post their rooftop solar requirements, vendors compete with transparent quotes, and a built-in calculator estimates system size, central + state subsidies, payback period, and lifetime savings.

**Production:** https://www.getasolar.in/

## Features

- Customer dashboard to post projects and review competing bids
- Vendor dashboard to discover open projects and submit bids
- Solar calculator with India-specific tariffs, subsidies, and CO₂ offset
- Vendor verification with private certification uploads
- Role-based access control (customer / vendor / admin)
- Supabase auth (email + Google OAuth) with RLS-protected data

## Tech Stack

- **Frontend:** React 18, Vite 5, TypeScript 5
- **UI:** Tailwind CSS, shadcn/ui, Radix UI
- **Backend:** Supabase (Postgres, Auth, Storage, Edge Functions)
- **Routing/State:** React Router, TanStack Query
- **Analytics:** Vercel Speed Insights, Google Analytics

## Getting Started

Prerequisites: Node.js 18+ and npm (install via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd get-a-solar

# 2. Install dependencies
npm install

# 3. Start the dev server (http://localhost:8080)
npm run dev
```

## Available Scripts

- `npm run dev` — start the local development server with hot reload
- `npm run build` — produce a production build in `dist/`
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## Project Structure

```
src/
  components/   Reusable UI and feature components
  pages/        Route-level pages
  hooks/        Custom React hooks
  contexts/     React context providers (auth, etc.)
  integrations/ Supabase client and generated types
  utils/        Domain logic (solar calc, bid ranking)
supabase/       Edge functions and SQL migrations
public/         Static assets (favicon, hero banner, sitemap)
```

## Deployment

The app is deployed via [Lovable](https://lovable.dev/projects/68bf9543-f6ca-4884-b5fa-86e5de9f4fe3). Open the project and click **Share → Publish**. A custom domain can be connected from **Project → Settings → Domains**.
