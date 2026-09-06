# DevOps Learning Roadmap (Easy → Advanced)

You already have a working MERN app.  
Learn tools in this order. **You write Docker / K8s / Jenkins / monitoring yourself.**

Tools to master:
1. Docker  
2. Kubernetes  
3. Load Balancer (Service + Ingress, later AWS ALB)  
4. Jenkins  
5. Prometheus  
6. Grafana  

---

## Overall production flow (memorize this)

```text
Developer pushes code to Git
        │
        ▼
Jenkins Pipeline
  1. Checkout
  2. Test
  3. Docker build (frontend + backend)
  4. Push images to registry
  5. kubectl apply / rollout to Kubernetes
        │
        ▼
Load Balancer / Ingress sends user traffic to Pods
        │
        ▼
Prometheus scrapes metrics → Grafana shows dashboards
```

---

## PHASE 0 — Run MERN first (today)

Goal: app works without containers.

1. Install Node.js + MongoDB on Ubuntu  
2. Start backend (`npm run seed` then `npm run dev`)  
3. Start frontend (`npm run dev`)  
4. Open Dashboard, Products, create an Order  

**Done when:** browser shows products and orders from MongoDB.

---

## PHASE 1 — Docker (Easy)

### What you learn
- Image vs Container  
- Dockerfile  
- Multi-stage build (frontend)  
- `.dockerignore`  
- Docker network (frontend talks to backend)

### You will write
- `backend/Dockerfile`  
- `frontend/Dockerfile`  
- (optional later) `docker-compose.yml`

### Practice flow
```text
Code → docker build → docker run → browser hits container port
```

### Success checklist
- [ ] Backend container responds on `/healthz`  
- [ ] Frontend container serves UI  
- [ ] Backend connects to MongoDB (local or mongo container)  
- [ ] You can explain every Dockerfile line  

---

## PHASE 2 — Kubernetes (Medium)

### What you learn
- Pod, Deployment, Service  
- Labels / selectors  
- Replicas + rolling update + rollback  
- Liveness / readiness probes  
- ConfigMap / Secret  
- Namespaces  

### You will write
- `k8s/backend-deployment.yaml`  
- `k8s/frontend-deployment.yaml`  
- `k8s/mongo.yaml` (or external Mongo)  
- `k8s/services.yaml`

### Practice flow
```text
Docker image → kubectl apply → Pods Running → Service exposes app
```

### Success checklist
- [ ] `kubectl get pods` shows frontend + backend Running  
- [ ] Delete one pod → it self-heals  
- [ ] `kubectl rollout undo` works after bad image  

---

## PHASE 3 — Load Balancer (Medium)

### What you learn
| Type | Use |
|---|---|
| ClusterIP | Internal only |
| NodePort | Quick external access on learning server |
| LoadBalancer | Cloud LB (AWS later) |
| Ingress | HTTP path/host routing (production style) |

### You will write
- Frontend Service  
- Backend Service  
- Ingress rule: `/` → frontend, `/api` → backend  

### Practice flow
```text
Browser → Ingress/LB → Service → Pod replicas
```

### On your single Ubuntu + K3s
Use Traefik Ingress (comes with K3s) or NodePort.

### Later on AWS EKS ($20 credits day)
Practice real **ALB / NLB**.

### Success checklist
- [ ] One URL serves UI  
- [ ] `/api` routes to backend  
- [ ] Traffic spreads across 2+ backend pods  

---

## PHASE 4 — Jenkins CI/CD (Medium → Advanced)

### What you learn
- Jenkins job / pipeline  
- Credentials store  
- Declarative `Jenkinsfile`  
- Build → Push → Deploy  

### You will write
- Root `Jenkinsfile`  
- Stages: Checkout → Test → Build images → Deploy to K8s  

### Practice flow
```text
Git push / Build Now
   → Jenkins builds Docker images
   → Updates K8s Deployment
   → Rollout status green
```

### Success checklist
- [ ] Manual “Build Now” deploys app  
- [ ] Failed test stops pipeline  
- [ ] You can explain each stage  

---

## PHASE 5 — Prometheus (Advanced)

### What you learn
- Pull model (scrape)  
- `/metrics` endpoint  
- Node exporter / kube-state-metrics  
- Alert rules  

### You will add (yourself)
- Metrics endpoint on backend (later)  
- Prometheus scrape config  
- Basic CPU / pod restart alerts  

### Practice flow
```text
App/Pods expose metrics → Prometheus scrapes every 15s → stores time series
```

---

## PHASE 6 — Grafana (Advanced)

### What you learn
- Add Prometheus as data source  
- Dashboards (pod CPU, request rate, errors)  
- Alert panels  

### Practice flow
```text
Prometheus data → Grafana panels → you detect issues visually
```

---

## Suggested weekly plan (on your 6 vCPU / 12 GB Ubuntu)

| Day | Focus |
|---|---|
| Day 1 | Phase 0 + Phase 1 Docker |
| Day 2 | Phase 2 Kubernetes Deployments/Services |
| Day 3 | Phase 3 Load Balancer / Ingress |
| Day 4 | Phase 4 Jenkins pipeline |
| Day 5 | Phase 5–6 Prometheus + Grafana |
| Later | 1–2 day AWS EKS with $20 credits |

---

## Interview story (use this app)

> “I built a MERN delivery portal (React + Express + MongoDB).  
> I containerized it with multi-stage Docker builds, deployed on Kubernetes with Deployments/Services/Ingress, automated releases with Jenkins, and monitored with Prometheus + Grafana.”

---

## Next action

1. Run MERN locally (Phase 0)  
2. Reply: **“Start Phase 1 Docker”**  

Then we go **step-by-step**, and **you write every DevOps file yourself**.
