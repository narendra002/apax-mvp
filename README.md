# Demo APAX App

A minimal Web3 demo showcasing a portfolio vault with a modern frontend, backend API, and smart contracts.

## 🧱 Stack

- **Frontend**: Next.js
- **Backend**: Node.js + Express + ethers
- **Smart Contracts**: Solidity (Hardhat)

## 🔁 Architecture Flow

Frontend → Backend → Blockchain

- The frontend never talks directly to the blockchain
- The backend provides clean APIs and reads on-chain data
- The smart contract is the source of truth

---

## 📁 Project Structure

```text
/apax
├── /smart-contracts          # Hardhat and Smart Contracts
│   ├── /contracts
│   ├── /scripts
│   ├── /test
│   ├── hardhat.config.ts
│   ├── package.json
│   └── .env
│
├── /web                 # Web frontend (Next.js)
│   ├── /app
│   ├── /components
│   ├── /hooks
│   ├── /lib
│   ├── /public
│   ├── /src
│   ├── package.json
│   └── tsconfig.json
│
├── /shared                   # Shared resources (like ABIs)
│   ├── /abi
│   └── constants.ts
│
└── README.md                 # Project documentation

```

## Install Dependencies

From the repository root:

```bash
cd web
npm install
```

## Run with the Project API

From the `web` directory:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> The project API expects MongoDB to be configured and running. Without it, login requests will fail before credentials can be checked.

## Run the Login Demo Locally

Use this mode to demonstrate the frontend login success flow without a MongoDB instance. It starts a temporary local login API on port `4001` and the Next.js app together.

From the `web` directory:

```bash
npm run dev:demo
```

Open the local URL printed by Next.js (normally [http://localhost:3000](http://localhost:3000)) and sign in with:

```text
Email: demo@apax.local
Password: DemoPass123!
```

The demo API returns the same response shape as the backend login endpoint:

```json
{
  "success": true,
  "user": { "id": "demo-user", "email": "demo@apax.local" },
  "token": "demo.jwt.token"
}
```

This allows verification that the frontend shows loading state, saves the token in localStorage under `apax.auth.token`, redirects to `/dashboard`, and clears the token on logout. Use any other credentials to test the invalid-credentials error state.

The demo API is intentionally local-only and does not use MongoDB or issue a real signed JWT. Normal `npm run dev` remains configured to use the project API at `http://localhost:4000` by default.
