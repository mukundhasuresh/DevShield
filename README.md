<div align="center">
  <img src="https://via.placeholder.com/1200x400/0a0a0a/6366f1?text=DevShield+Screenshot+Placeholder" alt="DevShield Banner" />
  
  <h1 align="center">DevShield</h1>
  <p align="center">
    <strong>AI-Powered DevSecOps seamlessly integrated into your workflows.</strong>
  </p>
  
  <p align="center">
    <a href="https://github.com/mukundhasuresh/DevShield/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js"></a>
    <a href="https://fastapi.tiangolo.com"><img src="https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi" alt="FastAPI"></a>
    <a href="https://polygon.technology"><img src="https://img.shields.io/badge/Polygon-Amoy-8V5CF6?logo=polygon" alt="Polygon"></a>
    <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase" alt="Supabase"></a>
  </p>

  <p align="center">
    <a href="#">View Live Demo</a> · <a href="#quick-start">Documentation</a> · <a href="https://github.com/mukundhasuresh/DevShield/issues">Report Bug</a>
  </p>
</div>

---

## 🛡️ Defend the Code. Secure the Chain.
DevShield is a B2B SaaS GitHub App that automatically scans every Pull Request for security vulnerabilities, hardcoded secrets, and supply chain attacks natively. By pairing state-of-the-art Anthropic Claude 3.5 AI Agents with immutable Polygon blockchain cryptographic logging, DevShield ensures zero-trust security from code to production.

## ✨ Elite Features
- **🤖 Autonomous AI Deep Scan** — Claude 3.5 Sonnet organically triages code, analyzes logic flaws, and identifies zero-day logic leaks undetectable by simple RegEx tools.
- **⛓️ Immutable Blockchain Audit** — Cryptographic hashes of all successful scans are logged onto the public Polygon Amoy network guaranteeing zero-trust immutability.
- **🛠️ Self-Healing PR Comments** — Generates synthetic code fixes automatically pushed as inline Git PR review comments.
- **⚡ Background Queues** — Powered natively by BullMQ and Redis, DevShield seamlessly scales out heavy security processing off the main API loop.
- **🎨 World-Class Dashboard** — Linear-tier UI designed in dark mode utilizing Framer Motion physics, providing sweeping metric visualization.

## 🏗️ Architecture
The DevShield Platform binds heavily decoupled systems orchestrating highly parallelized security workloads:
1. **GitHub App Webhooks**: Instantly listen to `pull_request` synchronized webhook events.
2. **Next.js & Supabase Engine**: Next.js 14 captures traffic routing directly pushing to a centralized Supabase queue array.
3. **FastAPI & Worker Processes**: BullMQ triggers an expansive 10-step CI Validation orchestration.
4. **AI Triage Matrix**: Claude Haiku maps surface flaws while Claude Sonnet dives dynamically into deep logic execution.
5. **Blockchain Committer**: `web3.py` commits SHA-256 result hashes directly to the `ScanAuditLog.sol` Smart Contract.

## 🚀 Quick Start
### Prerequisites
- Node.js `v18+` & Python `3.10+`
- [Supabase](https://supabase.com/) account
- GitHub App Registration
- Polygon testnet wallet & RPC Key

### Spin Up
```bash
# 1. Clone the repository
git clone https://github.com/mukundhasuresh/DevShield.git
cd DevShield

# 2. Install Frontend Dependencies
cd apps/web && npm install

# 3. Setup Python Backend Environment
cd ../../scanner
python -m venv venv
source venv/bin/activate # Windows: .\venv\Scripts\activate
pip install -r requirements.txt

# 4. Fill Environment Keys
# Duplicate .env.local templates for both Next.js and Python.

# 5. Launch Development Modules
# Terminal A (Next.js):
cd apps/web && npm run dev 
# Terminal B (FastAPI):
cd scanner && uvicorn api:app --reload
# Terminal C (BullMQ Process):
cd scanner && python queue/worker.py
```

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.
