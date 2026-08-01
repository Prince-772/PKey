# 🔐 PKey - Zero-Knowledge Password & PIN Manager

> Your vault. Encrypted before it ever leaves your device - your master password, your keys.

PKey is a privacy-first password and PIN manager. Secrets are encrypted **in your browser** with a key derived from your master password, so the server stores nothing it could decrypt - even if the database leaks.

**Live project:** [github.com/Prince-772/PKey](https://github.com/Prince-772/PKey)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth-4-000000?logo=auth0&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-100%25-F7DF1E?logo=javascript&logoColor=black)

---

## ✨ Features

**🔒 Zero-Knowledge Encryption**
- **Argon2id** key derivation (64 MB memory, 3 iterations) runs in a **Web Worker** - no UI freeze, no key material in JS main-thread state.
- **HKDF-SHA256** derives two independent keys from the master key: an *auth hash* (sent to the server for verification) and an *AES-GCM encryption key* (kept client-side, **never transmitted**).
- Raw encryption keys never leave the browser. The server only ever sees the salt and the auth hash.

**🗝️ Master Password**
- Created on signup, verified before any vault access, with **attempt lockout** (5 tries).
- Forgot it? The vault is unrecoverable by design - that's the trade-off of zero-knowledge. `Reset Vault` wipes and re-creates it.

**📦 Vault**
- **Passwords & PINs (passcodes)** - two entry types, one vault.
- **Multiple usernames** per entry - no more juggling accounts for the same site.
- **zxcvbn strength scoring** on every entry, plus built-in **password & PIN generators**.
- **Favorites** - pin the entries you use most.

**🛡️ Security & Account Controls**
- Email/password auth with **email verification**, plus **Google & GitHub** OAuth.
- **Forgot password** (email-token flow) and **reset vault** flows.
- **Delete account** with a double-confirmation email flow.
- **Login lockout**, **failed-attempt tracking**, and **per-route rate limiting** via Upstash Redis.
- **Maintenance mode** with an admin allowlist.
- Encrypted data migration path between encryption versions (`v1/v2 → v3`).

---

## 🏗️ Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com), [lucide-react](https://lucide.dev), [ldrs](https://github.com/GriffinJohnston/ldrs) loaders |
| Forms | [react-hook-form](https://react-hook-form.com) + [zod](https://zod.dev) |
| Auth | [NextAuth.js 4](https://next-auth.js.org) |
| Database | [MongoDB](https://www.mongodb.com) via [Mongoose 8](https://mongoosejs.com) |
| Rate limiting | [Upstash Redis](https://upstash.com) + `@upstash/ratelimit` |
| Crypto | [hash-wasm](https://github.com/Daninet/hash-wasm) (Argon2id), native Web Crypto (HKDF, AES-GCM) |
| Mail | [nodemailer](https://nodemailer.com) |
| Feedback | [react-hot-toast](https://react-hot-toast.com), [zxcvbn](https://github.com/dropbox/zxcvbn) |

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment - copy to .env.local and fill in your values
cp .env.example .env.local

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |

---

## 🔧 Environment Variables

Copy `.env.example` → `.env.local`. Required: **MongoDB** and **NextAuth secret**. Everything else is optional until you want the feature.

| Variable | Required | Purpose |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `NEXTAUTH_SECRET` | ✅ | Session signing secret (use a long random string) |
| `NEXTAUTH_URL` | - | Canonical app URL (defaults to localhost in dev) |
| `NEXT_PUBLIC_BASE_URL` | - | Public base URL used in email links |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | - | Google OAuth |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | - | GitHub OAuth |
| `EMAIL_ID` / `EMAIL_PASSWORD` | - | SMTP credentials for verification / reset / delete-account emails |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | - | Rate limiting |
| `ADMIN_EMAIL1` … `ADMIN_EMAIL5` | - | Maintenance-mode allowlist |
| `MAINTENANCE_MODE` | - | Set `"true"` to take the site down except admins |

---

## 🧠 How It Works

1. **Signup** → your master password is fed to **Argon2id** in a Web Worker → derives a 256-bit master key.
2. **HKDF** splits that key into:
   - `authHash` → stored on the server (verifies your master password at unlock).
   - `encryptionKey` → stays in memory, encrypts/decrypts your vault with **AES-GCM**.
3. **Every secret** is encrypted in the browser before hitting the API. The server stores ciphertext only.
4. **Unlock** → re-derive the master key from your password + stored salt, verify against `authHash`, decrypt locally.

Result: a database breach exposes only salted hashes and ciphertext - nothing an attacker can read.

```
Argon2id ──▶ master key ──▶ HKDF-SHA256 ──▶ authHash        → server (verification only)
                       └───────────────▶ encryptionKey ──▶ AES-GCM  → stays in browser
```

---

## 📁 Project Structure

```
├── app/
│   ├── (auth)/                # Signup, sign-in, email/password reset, account recovery
│   ├── (main)/(protected)/    # Dashboard, vault (passwords + passcodes), security
│   └── api/
│       ├── auth/              # Auth, verification, password-reset endpoints
│       └── protected/         # Password & passcode CRUD, vault reset, account deletion
├── components/                # UI: cards, modals, forms, generators, sidebar
├── context/                   # React providers (MasterPassword, Passwords, Passcodes)
├── lib/
│   ├── masterpassword/        # Argon2id/HKDF worker + vault crypto (v3)
│   ├── passwords/             # Encrypt, strength-check, suggest, CRUD helpers
│   ├── passcodes/             # PIN equivalents
│   ├── auth/                  # Sign-up / sign-in / resend-email handlers
│   ├── managers/              # Mailer
│   ├── rateLimit.js           # Upstash rate-limit definitions
│   └── dbConnect.js           # Mongoose connection singleton
├── models/                    # Mongoose schemas: User, Passwords, Passcode
└── proxy.js                   # Route guard: maintenance, rate limits, auth checks
```

---

## 🛟 FAQ

**Why can't you recover my vault if I forget my master password?**
Because nobody - not even the server - can reconstruct your encryption key. That's the core promise of zero-knowledge. Use the **Reset Vault** flow to start fresh (old entries are unrecoverable).

**Where do my encryption keys live?**
In browser memory, for the duration of the session. They are never sent to the server, never written to disk, and gone when you log out.

**Are my secrets encrypted at rest on the server?**
They're encrypted *before* they arrive - the database stores AES-GCM ciphertext whose key exists only on your device.

---

## 📄 License

Private project. All rights reserved.
