# Ptap Delivery Portal (MERN)

Clean MERN application only — **no Docker / Kubernetes / Jenkins / Prometheus code**.  
You will add those yourself while learning.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Vite + React + Tailwind |
| Backend | Node.js + Express |
| Database | MongoDB |

## Project structure

```text
mern-ecommerce-project/
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── seed.js
│       ├── models/
│       │   ├── Product.js
│       │   └── Order.js
│       └── routes/
│           ├── products.js
│           ├── orders.js
│           └── stats.js
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── components/Navbar.jsx
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── Products.jsx
        │   └── Orders.jsx
        └── services/api.js
```

## How the app works (request flow)

```text
Browser (React :3000)
    │  GET /api/products, POST /api/orders, GET /api/stats
    ▼
Vite Dev Proxy  ──►  Express API (:5000)
                          │
                          ▼
                     MongoDB (:27017)
                     db: ptap_delivery
```

## Run locally (before DevOps)

### 1. MongoDB
Install and start MongoDB on your Ubuntu server, then:

```bash
# Backend
cd mern-ecommerce-project/backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### 2. Frontend (new terminal)

```bash
cd mern-ecommerce-project/frontend
npm install
npm run dev
```

Open: `http://YOUR_SERVER_IP:3000`

### API endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/healthz` | Health check |
| GET | `/api/products` | List products |
| GET | `/api/orders` | List orders |
| POST | `/api/orders` | Create order |
| PATCH | `/api/orders/:orderId/status` | Update status |
| GET | `/api/stats` | Dashboard stats |

## Architecture (application today)

```text
┌─────────────────────────────────────────────┐
│                 USER BROWSER                │
│         Ptap Delivery Portal (React)        │
│   Dashboard | Products | Order Dispatch     │
└─────────────────────┬───────────────────────┘
                      │ HTTP JSON
                      ▼
┌─────────────────────────────────────────────┐
│              EXPRESS BACKEND                │
│  /healthz  /api/products  /api/orders       │
│  /api/stats                                 │
└─────────────────────┬───────────────────────┘
                      │ Mongoose ODM
                      ▼
┌─────────────────────────────────────────────┐
│                   MONGODB                   │
│         products collection                 │
│         orders collection                   │
└─────────────────────────────────────────────┘
```

## Target architecture (after you learn DevOps)

```text
                    ┌──────────────────┐
                    │   LOAD BALANCER  │
                    │  (Ingress / ALB) │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼                             ▼
     ┌─────────────────┐           ┌─────────────────┐
     │ Frontend Pods   │           │ Backend Pods    │
     │ (Nginx + React) │──/api───► │ (Node Express)  │
     └─────────────────┘           └────────┬────────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │    MongoDB      │
                                   └─────────────────┘

     Jenkins CI/CD ──► Docker Build ──► Registry ──► K8s Deploy

     Prometheus scrapes metrics ──► Grafana dashboards + alerts
```

See **`LEARNING_ROADMAP.md`** for step-by-step learning (easy → advanced).
