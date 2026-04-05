# Swoin — Borderless Payments

> **Borderless Payments. Zero Hassle.**

Swoin is a full-stack cross-border payments platform that lets users send, receive, deposit, and withdraw **USDM** (a stable digital currency) anywhere in the world. It is built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and PostgreSQL.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [Authentication & Security](#authentication--security)
- [Scripts](#scripts)

---

## Overview

Swoin operates as a **custodial payment platform** where every user holds a USDM balance managed by a shared global ledger. Key platform metrics:

- 180+ countries supported
- Sub-30-second settlement (T+0)
- Bank account linking via **Plaid**
- On-ramp processing via **Crossmint**

---

## Features

| Feature                  | Description                                                    |
| ------------------------ | -------------------------------------------------------------- |
| **P2P Transfers**        | Send USDM to any user by email with an optional note           |
| **Deposit / Onramp**     | Add funds through a connected bank account (Plaid + Crossmint) |
| **Withdrawal / Cashout** | Withdraw USDM back to a linked bank account                    |
| **Activity History**     | Paginated view of all transactions, deposits, and withdrawals  |
| **Payment Methods**      | Add and remove bank accounts via Plaid Link                    |
| **Dashboard**            | Real-time balance and quick-action cards                       |
| **Profile & Settings**   | Account info and preferences                                   |

---

## Tech Stack

### Frontend

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [react-plaid-link](https://github.com/plaid/react-plaid-link) — bank account linking

### Backend

- Next.js API Routes (Node.js)
- [PostgreSQL](https://www.postgresql.org/) via [`pg`](https://node-postgres.com/)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — password hashing (12 rounds)
- HMAC-SHA256 session tokens stored in HttpOnly cookies

---

## Project Structure

```
BagelHacks/
└── swoin/                   # Main application
    ├── app/
    │   ├── api/             # API route handlers
    │   │   ├── auth/        # signin, signup, session, signout
    │   │   ├── transfer/    # P2P transfers
    │   │   ├── transactions/# Transaction history
    │   │   ├── deposit/     # Deposit / onramp
    │   │   ├── cashout/     # Withdrawal
    │   │   ├── payment-methods/
    │   │   ├── plaid/       # Plaid link & token exchange
    │   │   ├── users/       # User search
    │   │   └── global-wallet/
    │   ├── components/      # Shared UI components
    │   │   ├── AppShell.tsx
    │   │   ├── Sidebar.tsx
    │   │   ├── TopBar.tsx
    │   │   ├── BottomNav.tsx
    │   │   └── ToastProvider.tsx
    │   ├── dashboard/
    │   ├── send/
    │   ├── review/
    │   ├── cashout/
    │   ├── deposit/
    │   ├── activity/
    │   ├── cards/
    │   ├── profile/
    │   ├── settings/
    │   ├── login/
    │   └── page.tsx         # Landing page
    ├── lib/
    │   ├── db.ts            # PostgreSQL connection & queries
    │   ├── auth.ts          # Password hashing & verification
    │   └── session.ts       # HMAC session token management
    ├── proxy.ts             # Next.js middleware (auth routing)
    ├── package.json
    ├── tsconfig.json
    └── next.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
# 1. Navigate to the app directory
cd swoin

# 2. Install dependencies
npm install

# 3. Copy and fill in environment variables
cp .env.example .env.local   # create this file manually if it doesn't exist

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file inside `swoin/` with the following variables:

```env
# PostgreSQL connection
PGHOST=localhost
PGPORT=5432
PGUSER=your_db_user
PGDATABASE=swoin
PGPASSWORD=your_db_password

# Session signing secret (use a long random string)
SESSION_SECRET=your_super_secret_key

# Node environment
NODE_ENV=development
```

---

## Database Schema

```sql
-- User credentials
CREATE TABLE login (
    id       SERIAL PRIMARY KEY,
    email    TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL          -- bcrypt hash
);

-- User balances (USDM)
CREATE TABLE balance (
    id      INT PRIMARY KEY REFERENCES login(id),
    balance NUMERIC(18, 8) NOT NULL DEFAULT 0
);

-- P2P transactions
CREATE TABLE transactions (
    id          SERIAL PRIMARY KEY,
    sender_id   INT REFERENCES login(id),
    receiver_id INT REFERENCES login(id),
    amount      NUMERIC(18, 8) NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Linked payment methods (bank accounts via Plaid)
CREATE TABLE payment_methods (
    id                 SERIAL PRIMARY KEY,
    user_id            INT REFERENCES login(id),
    type               TEXT,
    label              TEXT,
    details            TEXT,
    plaid_access_token TEXT,
    plaid_account_id   TEXT,
    created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Deposits / onramp events
CREATE TABLE deposits (
    id                   SERIAL PRIMARY KEY,
    user_id              INT REFERENCES login(id),
    method_label         TEXT,
    amount               NUMERIC(18, 8) NOT NULL,
    crossmint_payment_id TEXT,
    created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Withdrawals / cashout events
CREATE TABLE withdrawals (
    id           SERIAL PRIMARY KEY,
    user_id      INT REFERENCES login(id),
    method_id    INT,
    method_label TEXT,
    amount       NUMERIC(18, 8) NOT NULL,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Custodial USDM pool (global wallet)
CREATE TABLE global_wallet (
    id           INT PRIMARY KEY DEFAULT 1,
    usdm_balance NUMERIC(18, 8) NOT NULL DEFAULT 0
);
```

---

## API Routes

| Method          | Route                       | Description                                  |
| --------------- | --------------------------- | -------------------------------------------- |
| POST            | `/api/auth/signup`          | Register a new user (grants 10,000 USDM)     |
| POST            | `/api/auth/signin`          | Authenticate and create a session            |
| GET             | `/api/auth/session`         | Return the current session user              |
| POST            | `/api/auth/signout`         | Clear the session cookie                     |
| POST            | `/api/transfer`             | Transfer USDM to another user                |
| GET             | `/api/transactions`         | Fetch transaction history                    |
| GET/POST/DELETE | `/api/payment-methods`      | Manage linked payment methods                |
| POST            | `/api/deposit`              | Record a deposit and credit balance          |
| POST            | `/api/cashout`              | Record a withdrawal and debit balance        |
| GET             | `/api/cashout/routes`       | List available cashout destinations          |
| GET             | `/api/users/search`         | Search users by email                        |
| POST            | `/api/plaid/link-token`     | Generate a Plaid Link token                  |
| POST            | `/api/plaid/exchange-token` | Exchange Plaid public token for access token |
| GET             | `/api/global-wallet`        | Get or update the global USDM pool balance   |

---

## Authentication & Security

- Passwords are hashed with **bcrypt** at cost factor 12.
- Sessions use **HMAC-SHA256** signed tokens stored in **HttpOnly, Secure** cookies with a 7-day expiry.
- Token comparison is timing-safe.
- Balance updates use **row-level locking** (`SELECT … FOR UPDATE`) inside a PostgreSQL transaction to prevent race conditions.
- Unauthenticated requests to protected routes are redirected to `/login` by the Next.js middleware (`proxy.ts`).

---

## Scripts

From inside the `swoin/` directory:

```bash
npm run dev    # Start development server (hot reload)
npm run build  # Compile for production
npm start      # Run the production build
npm run lint   # Run ESLint
```
