# ⚡ SaaSForge Engine — Multi-Tenant AI SaaS & Token Metering Hub

A production-ready **Multi-Tenant AI SaaS Dashboard & Monetization Infrastructure Starter** engineered with Next.js 15, Groq Cloud LLMs, dynamic token quota metering, tier paywalls, developer API key lifecycle management, and real-time telemetry streaming.


---

## 🌟 Key Product Features

- **📊 Live AI Token Metering & Quota Progress:** Real-time token consumption tracking (prompt + completion tokens) with dynamic visual health meters and balance decrementing.
- **🛡️ 1-Click Evaluator Role Switcher:** Instant switcher allowing evaluators and hiring managers to toggle between `[Free Starter]`, `[Pro Developer]`, and `[Enterprise Admin]` to test role-based access control and paywalls without signing up.
- **🔒 Tier Paywall & Model Gating:** Hard gates restricting premium reasoning models (`openai/gpt-oss-120b`, `qwen/qwen3.6-27b`) and high-throughput quotas behind an interactive Stripe-style upgrade checkout simulator.
- **🔑 Developer API Key Vault:** Full API key lifecycle with scoped labeling, "reveal-once" raw secret modals (`sf_live_...`), secure key masking (`sf_live_8f7b...e92a`), and instant revocation.
- **⚡ Sub-500ms Edge AI Playground:** In-browser multi-model execution sandbox powered by Groq Compound AI that live-streams telemetry and logs latency in milliseconds.
- **📈 Real-Time Usage & Cost Telemetry:** Live activity feed recording timestamps, model names, token breakdowns (input $\rightarrow$ output), response times, and estimated cloud cost in USD.

---

## 🛠️ Architecture & Tech Stack

- **Framework:** Next.js 15 (App Router, Server Actions, TypeScript)
- **AI Infrastructure:** Groq Cloud SDK (`groq/compound-mini`, `qwen/qwen3.6-27b`, `openai/gpt-oss-120b`)
- **State Management:** Reactive React Context with automatic `localStorage` persistence & 1-click sandbox reset
- **Styling & UI:** Tailwind CSS, Lucide Icons, Canvas Confetti
- **Deployment:** Vercel Edge Network

---

## 🚀 Quickstart & Local Development

### 1. Clone & Install
```bash
git clone https://github.com/eugeneleroy29/saasforge-engine.git
cd saasforge-engine
npm install
```

### 2. Configure Environment Secrets
Create a `.env.local` file in the project root:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to access the dashboard.

---

## 📊 Subscription Tier Matrix

| Feature | Starter Sandbox (Free) | Pro Developer (9/mo) | Enterprise Scale (99/mo) |
| :--- | :--- | :--- | :--- |
| **Monthly Token Quota** | 10,000 tokens | 250,000 tokens | 2,000,000 tokens |
| **Rate Limit** | 5 req / min | 30 req / min | 120 req / min |
| **Allowed AI Models** | `groq/compound-mini` | `groq/compound-mini`, `qwen/qwen3.6-27b` | All Models (incl. `openai/gpt-oss-120b`) |
| **Developer API Keys** | ❌ Blocked (Paywalled) | ✅ Active (Sub-500ms Edge) | ✅ Unlimited Active Keys |
| **Telemetry & Cost Logs**| ✅ Browser Only | ✅ Full Telemetry Stream | ✅ Dedicated High-Concurrency Quota |

---

## 👤 Author & Portfolio Context

- **Author:** Eugene Leroy ([@eugeneleroy29](https://github.com/eugeneleroy29))
- **Commercial Flagship:** ForgeCV ([www.forgecv.org](https://www.forgecv.org))
