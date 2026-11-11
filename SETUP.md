# 057 Cafè: setup and operations

The site is a static React app (Vite, Tailwind) hosted on GitHub Pages. Content,
booking requests and staff access live in Firebase (Firestore + Authentication).
Without Firebase configured the site still works and shows its built-in content.

## How content flows

- `src/content/defaults.ts` holds the built-in content (the fallback).
- Firestore collection `content` holds one document per section
  (`site`, `home`, `menu`, `events`, `gallery`, `booking`).
- Public pages only read. They load all sections in one request, check every
  field (`src/content/validate.ts`), and fall back to the last good copy or the
  built-in content if the store is empty, unreachable or invalid.
- Staff edit content at `/admin`. Every save is checked in the browser and
  again by `firestore.rules`, which is the real permission check.

## One-time Firebase setup

1. Create a Firebase project. Add a **Web app** and copy its config.
2. **Authentication > Sign-in method**: enable Email/Password and Google.
   Under **Settings > Authorised domains** add the site's domain
   (for example `inno202.github.io` and `057cafe.co.za`).
3. **Firestore Database**: create it in production mode.
4. The live config is in `.env.production` (project `cafe-3155d`). For local work against the real project, copy it to `.env.local`.
5. Publish the rules and the booking auto-delete policy:

   ```bash
   npx firebase-tools@14 login
   npx firebase-tools@14 deploy --only firestore
   ```

6. Create the first owner. Open the site at `/admin`, choose
   "Create your account", confirm the email, then in the Firebase console add a
   document in the `staff` collection:
   - Document ID: the owner's email address in lower case
   - Fields: `name` (string), `role` (string) = `owner`, `active` (boolean) = `true`

   After that, owners add everyone else from **Staff access** in the admin area.
7. Recommended: turn on **App Check** with reCAPTCHA v3, set
   `VITE_FIREBASE_APPCHECK_SITE_KEY`, and enforce App Check for Firestore. This
   stops scripts from flooding the public booking form.

## Roles

| Role | Website content | Booking requests | Staff |
|---|---|---|---|
| Owner | edit | view, update, delete | manage |
| Manager | edit | view, update, delete | none |
| Host | none | view, update | none |

## Commands

```bash
npm run dev          # local site
npm run typecheck    # TypeScript
npm test             # content, validation, booking, role tests
npm run test:rules   # security-rule tests (starts the Firestore emulator, needs Java)
npm run build        # production build
npm run deploy       # publish to GitHub Pages
```

To try the admin area locally without touching the real project, set
`VITE_FIREBASE_EMULATORS=1` in `.env.local` and run `npm run emulators`.

## Data kept

- Booking requests: name, phone, date, time, guests, event or occasion details.
  Each carries an `expireAt` date 365 days ahead; the Firestore TTL policy in
  `firestore.indexes.json` deletes it after that. The Privacy Policy states
  this, so keep the two in step.
- Staff: email address, name, role.

If a change alters what is collected, stored, charged or promised, update
`src/views/pages/LegalPages.tsx` and its "Last updated" date in the same change.
