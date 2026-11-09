# Template with Supabase, DaisyUI, React Icons & Zustand

This is a Next.js app scaffolded as a Supabase authentication template using:

- Supabase for authentication and database access
- DaisyUI (Tailwind CSS plugin) for components & theming
- React Icons for iconography
- Zustand for lightweight client state management

The template focuses on auth flows (login, signup, confirm-email), a simple Admin page protected by server-side session checks, and helpful UI utilities like toasts.

---

## Quick Start 🚀

1) Install

```powershell
npm install
# or
yarn
# or
pnpm install
```

2) Environment: copy `.env.example` to `.env.local` and fill your Supabase project values

```powershell
copy .env.example .env.local
# Edit .env.local and set values for SUPABASE_PROJECT_URL and SUPABASE_API_KEY
```

3) Run the dev server

```powershell
npm run dev
```

Open http://localhost:3000

---

## Useful NPM Scripts

- `npm run dev` - Run Next.js in development
- `npm run build` - Build for production
- `npm run start` - Start built app
- `npm run lint` - Run ESLint
- `npm run types-db` - Regenerate Supabase database types (requires `PROJECT_REF`)

Tip: The `types-db` helper uses the Supabase CLI to generate TypeScript types and writes them to `supabase/database.types.ts`.

---

## Environment Variables 🌐

Place these in `.env.local`

- `SUPABASE_PROJECT_URL` - your Supabase project URL (e.g. https://abcxyz.supabase.co)
- `SUPABASE_API_KEY` - your Supabase API key (use a server or service key on server-side code; do not expose it in the browser)
- `PROJECT_REF` - optional used by `npm run types-db` to generate DB types

---

## How the Template is Organized 📁

- `app/` - Next.js App Router pages and components
  - `layout.tsx` - Server-side root layout; bootstraps Supabase server client using cookies
  - `layoutClient.tsx` - Client layout to hydrate zustand user store
  - `page.tsx` - Home page (renders `Header`)
  - `admin/page.tsx` - Admin page protected using server-side session check
  - `auth/login/page.tsx` - Login page (redirects if already logged in)
  - `auth/signup/page.tsx` - Sign-up page
  - `auth/confirm-email/page.tsx` - Email confirm page used by Supabase email confirmation redirects

- `module/` - small module directory grouping by responsibility:
  - `auth/actions/session.ts` - `login`, `logout` and `signUp` server actions that call Supabase auth through `createClient`
  - `auth/components/form.tsx` - `FormLogin` and `FormRegister` (UI handling & component using `react-icons` + `daisyui` classes)
  - `auth/context/useUser.ts` - zustand store that holds the current user and `updateUser`/`exit` methods
  - `admin/index.tsx` - Admin UI component with logout button
  - `common/components/header.tsx` - Header UI that uses user state to show login/signup or admin link
  - `common/components/toast.tsx` and `common/hook/useToast.tsx` - Toast component and zustand hook to trigger toasts

- `supabase/` - helper files for supabase integration
  - `server.ts` - wraps `createServerClient` and configures cookie handlers for SSR sessions
  - `middleware.ts` - refreshes auth session on incoming request in `app/middleware.ts`
  - `database.types.ts` - Supabase generated types (run `npm run types-db` to regenerate)

---

## Authentication Flow & Key Components 🔐

1) Server-side `createClient` (`supabase/server.ts`):
   - Provides a simple `createServerClient()` wrapper used by server-side code (e.g. `layout.tsx` and `admin/page.tsx`), so you can verify the currently logged-in user in server components.

2) `app/layout.tsx`:
   - Uses `createClient()` to get user on server; renders `LayoutClient` with `user` prop.
   - `LayoutClient` (client component) updates the `useUser` zustand store when the user exists.

3) `app/middleware.ts` + `supabase/middleware.ts`:
   - The middleware calls `updateSession`, which creates a server client and calls `auth.getUser()` to refresh cookies and the session for the incoming request.

4) Login & Signup:
   - `FormLogin` and `FormRegister` are client components that call server actions in `module/auth/actions/session.ts` to avoid exposing the key in the client-side bundle.
   - On successful login, the user is stored in the `useUser` store and redirected.

5) Admin page:
   - `app/admin/page.tsx` uses `createClient()` server-side to ensure the current request has a valid user; if not, shows unauthorized. This is a simple pattern for server-side protected routes.

---

## UI (DaisyUI + React Icons) ✨

- The UI uses Tailwind CSS + DaisyUI components and utility classes (see `globals.css` and `app/layout.tsx` where `data-theme="lofi"` is set).
- React Icons are used inside forms and toasts (`react-icons/io`, `react-icons/md`, `react-icons/bs`).
- Feel free to change `data-theme` to a different DaisyUI theme or tweak `globals.css` theme variables.

---

## Local Development 💡

1) Start dev server

```powershell
npm run dev
```

2) Create a Supabase project and configure the URL and Key on `.env.local`.

3) Optional: Generate types from your Supabase project

```powershell
setx PROJECT_REF "your_project_ref_here"; npm run types-db
```

4) Confirm the auth flows:
- Visit `/auth/signup` to create a new user.
- Confirm the email (if configured in Supabase)
- Visit `/auth/login` and log in.
- Visit `/admin` to see the protected admin page.

---

## Deployment Notes

- When deploying to Vercel or similar: set `SUPABASE_PROJECT_URL` and `SUPABASE_API_KEY` as environment variables for the production environment. Use a server key or a restricted key for server-side operations.
- `middleware.ts` will automatically refresh server session and manage cookies for SSR.

---

## Security & Best Practices ⚠️

- Do not hardcode your Supabase API key in code; always use environment variables.
- Keep public ANON keys for client usage and server-only keys on the server.
- Consider rotating keys and restricting service roles as needed for production.

---

## Helpful Commands (copy/paste) 📋

Install deps
```powershell
npm install
```

Run dev server
```powershell
npm run dev
```

Generate types (mac/windows note)
```powershell
setx PROJECT_REF "your_project_ref_here"; npm run types-db
# On macOS / Linux:
PROJECT_REF=your_project_ref_here npm run types-db
```

Build for production
```powershell
npm run build
```

Start built app
```powershell
npm run start
```

---

## Where to Start as a Developer 🧭

1) Edit forms (components in `module/auth/components`) to add fields.
2) Update the `useUser` store to store more user metadata.
3) Use `createClient()` to run server-side queries and restrict sensitive logic to server files.
4) Add more protected pages using server-side `createClient()` checks (like `app/admin/page.tsx`).

---

If you want, I can also add a detailed CONTRIBUTING section and a sample `.env.local` template with placeholders if you'd like me to commit it to the repo. Just tell me which extra details you'd like included!

---

## Code Examples 🧪

1) Fetch rows from a table from a server component (server-side):

```ts
import { createClient } from '@/supabase/server'

export default async function Page() {
   const client = await createClient()
   const { data, error } = await client.from('users').select('*')
   if (error) console.error(error)
   return <pre>{JSON.stringify(data, null, 2)}</pre>
}
```

2) Server action login example (client triggers server action that wraps Supabase):

```tsx
// in module/auth/components/form.tsx (client)
const response = await login(email, password) // login is a server action
```

3) Using `useUser` (zustand) to read user in a client component:

```tsx
import { useUser } from '@/module/auth/context/useUser'

export function MyComponent(){
   const user = useUser(state => state.user)
   return <div>{user?.email ?? 'No user'}</div>
}
```

4) Using `useToast` to open a toast:

```tsx
import { useToast } from '@/module/common/hook/useToast'

const { openToast } = useToast()
openToast('Hello world!', 'success', 3000)
```

