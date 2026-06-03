# ArgoCD Deplyoment

# Beginner-Friendly Roadmap: Docker Image → Nexus → Helm → Argo CD → Kubernetes Deployment

Sources: Kubernetes HPA docs, Helm docs, and Argo CD docs. Kubernetes HPA scales Pods horizontally based on load; Helm is the Kubernetes package manager; Argo CD is a GitOps CD tool that keeps Kubernetes synchronized with Git.

---

## 1. Big Picture

```
Developer
   |
   | 1. Push code
   v
Git Repository
   |
   | 2. CI builds Docker image
   v
Container Registry
Nexus / Docker Hub / ECR / GCR / ACR
   |
   | 3. Image tag is updated in Helm values
   v
GitOps Repository
   |
   | 4. Argo CD watches Git
   v
Kubernetes Cluster
   |
   | 5. Kubernetes runs app Pods
   v
Users access app through Ingress / LoadBalancer
```

Simple meaning:

```
Code becomes image.
Image goes to registry.
Helm describes how to run it.
Argo CD deploys it.
Kubernetes keeps it alive and scales it.
```

---

# 2. Tools You Need

## Windows

Install:

```
wingetinstallDocker.DockerDesktop
wingetinstallKubernetes.kubectl
wingetinstallHelm.Helm
wingetinstallGit.Git
```

Optional Argo CD CLI:

```
wingetinstallArgoCD.ArgoCD
```

## macOS

```
brew installgit kubectl helm argocd
```

Docker Desktop:

```
brew install--cask docker
```

## Linux Ubuntu/Debian

```
sudo apt update
sudo apt install-ygitcurl ca-certificates
```

Install kubectl:

```
curl-LO"https://dl.k8s.io/release/stable.txt"
```

Install Helm:

```
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 |bash
```

Install Argo CD CLI:

```
curl-sSL-o argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
chmod+x argocd
sudomv argocd /usr/local/bin/
```

---

# 3. Core Concepts for Beginners

## Kubernetes

Kubernetes runs your application inside containers.

Important objects:

| Object | Simple Meaning |
| --- | --- |
| Pod | Smallest running unit. Usually one app container. |
| Deployment | Manages Pods and updates them safely. |
| Service | Gives Pods a stable internal address. |
| Ingress | Exposes the app to the internet using a domain. |
| ConfigMap | Stores non-secret config. |
| Secret | Stores passwords, tokens, credentials. |
| HPA | Automatically increases/decreases Pod count. |
| Namespace | Logical folder inside Kubernetes. |

---

# 4. Example Real-World Application

Assume we have a backend app:

```
App name: ticket-api
Port: 8080
Image registry: nexus.company.com
Image name: ticket-api
Environment: dev
Domain: ticket-api-dev.company.com
```

---

# 5. Dockerfile Example

Create a file named `Dockerfile`.

```
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY target/ticket-api.jar app.jar

EXPOSE8080

ENTRYPOINT ["java","-jar","app.jar"]
```

Build image:

## Windows PowerShell

```
dockerbuild-tnexus.company.com/ticket-api:1.0.0 .
```

## macOS/Linux

```
docker build-t nexus.company.com/ticket-api:1.0.0 .
```

Login to Nexus:

```
docker login nexus.company.com
```

Push image:

```
docker push nexus.company.com/ticket-api:1.0.0
```

---

# 6. Helm Chart Structure

Create chart:

```
helm create ticket-api
```

Recommended structure:

```
ticket-api/
  Chart.yaml
  values.yaml
  templates/
    deployment.yaml
    service.yaml
    ingress.yaml
    hpa.yaml
    configmap.yaml
    secret.yaml
```

---

# 7. Helm `values.yaml`

```
replicaCount: 2

image:
  repository: nexus.company.com/ticket-api
  tag:"1.0.0"
  pullPolicy: IfNotPresent

imagePullSecrets:
  - name: nexus-registry-secret

service:
  type: ClusterIP
  port: 80
  targetPort: 8080

ingress:
  enabled: true
  className: nginx
  host: ticket-api-dev.company.com
  path: /

resources:
  requests:
    cpu:"250m"
    memory:"512Mi"
  limits:
    cpu:"500m"
    memory:"1Gi"

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

env:
  SPRING_PROFILES_ACTIVE: dev
  LOG_LEVEL: INFO
```

---

# 8. Kubernetes Deployment Template

`templates/deployment.yaml`

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}
  labels:
    app: {{ .Release.Name }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ .Release.Name }}
  template:
    metadata:
      labels:
        app: {{ .Release.Name }}
    spec:
      imagePullSecrets:
        {{- toYaml .Values.imagePullSecrets | nindent 8 }}
      containers:
        - name: {{ .Release.Name }}
          image:"{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - containerPort: {{ .Values.service.targetPort }}
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: {{ .Values.env.SPRING_PROFILES_ACTIVE | quote }}
            - name: LOG_LEVEL
              value: {{ .Values.env.LOG_LEVEL | quote }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
```

---

# 9. Service Template

`templates/service.yaml`

```
apiVersion: v1
kind: Service
metadata:
  name: {{ .Release.Name }}
spec:
  type: {{ .Values.service.type }}
  selector:
    app: {{ .Release.Name }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: {{ .Values.service.targetPort }}
```

Meaning:

```
Pods can change.
Service gives them one stable address.
Other apps talk to the Service, not directly to Pods.
```

---

# 10. Ingress Template

`templates/ingress.yaml`

```
{{- if .Values.ingress.enabled }}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ .Release.Name }}
spec:
  ingressClassName: {{ .Values.ingress.className }}
  rules:
    - host: {{ .Values.ingress.host }}
      http:
        paths:
          - path: {{ .Values.ingress.path }}
            pathType: Prefix
            backend:
              service:
                name: {{ .Release.Name }}
                port:
                  number: {{ .Values.service.port }}
{{- end }}
```

Flow:

```
User Browser
   |
   v
ticket-api-dev.company.com
   |
   v
Ingress Controller
   |
   v
Service
   |
   v
Pod 1 / Pod 2 / Pod 3
```

---

# 11. HPA Template

`templates/hpa.yaml`

```
{{- if .Values.autoscaling.enabled }}
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ .Release.Name }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ .Release.Name }}
  minReplicas: {{ .Values.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.autoscaling.maxReplicas }}
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: {{ .Values.autoscaling.targetCPUUtilizationPercentage }}
{{- end }}
```

Meaning:

```
If average CPU goes above 70%, Kubernetes adds more Pods.
If traffic drops, Kubernetes removes extra Pods.
```

Kubernetes HPA works by automatically updating workload replica counts to match demand.

---

# 12. Create Nexus Image Pull Secret

Kubernetes needs credentials to pull private images.

```
kubectl create namespace ticket-dev
```

```
kubectl create secret docker-registry nexus-registry-secret \
--docker-server=nexus.company.com \
--docker-username=YOUR_USERNAME \
--docker-password=YOUR_PASSWORD \
--docker-email=you@company.com \
-n ticket-dev
```

Windows PowerShell version:

```
kubectlcreatesecretdocker-registrynexus-registry-secret `
--docker-server=nexus.company.com `
--docker-username=YOUR_USERNAME `
--docker-password=YOUR_PASSWORD `
--docker-email=you@company.com `
-nticket-dev
```

---

# 13. Test Locally with Helm

Render YAML without deploying:

```
helm template ticket-api ./ticket-api-n ticket-dev
```

Install:

```
helm upgrade--install ticket-api ./ticket-api-n ticket-dev
```

Check:

```
kubectlget pods-n ticket-dev
kubectlget svc-n ticket-dev
kubectlget ingress-n ticket-dev
kubectlget hpa-n ticket-dev
```

Rollback:

```
helm rollback ticket-api1-n ticket-dev
```

---

# 14. Git Repository Layout

Recommended:

```
deployment-repo/
  apps/
    ticket-api/
      Chart.yaml
      values.yaml
      templates/
        deployment.yaml
        service.yaml
        ingress.yaml
        hpa.yaml
  environments/
    dev/
      ticket-api-values.yaml
    staging/
      ticket-api-values.yaml
    prod/
      ticket-api-values.yaml
  argocd/
    ticket-api-dev.yaml
    ticket-api-staging.yaml
    ticket-api-prod.yaml
```

---

# 15. Environment Values

## Dev

`environments/dev/ticket-api-values.yaml`

```
replicaCount: 1

image:
  repository: nexus.company.com/ticket-api
  tag:"1.0.0"

ingress:
  host: ticket-api-dev.company.com

autoscaling:
  minReplicas: 1
  maxReplicas: 3
  targetCPUUtilizationPercentage: 70
```

## Production

`environments/prod/ticket-api-values.yaml`

```
replicaCount: 3

image:
  repository: nexus.company.com/ticket-api
  tag:"1.0.0"

ingress:
  host: ticket-api.company.com

autoscaling:
  minReplicas: 3
  maxReplicas: 20
  targetCPUUtilizationPercentage: 60

resources:
  requests:
    cpu:"500m"
    memory:"1Gi"
  limits:
    cpu:"1"
    memory:"2Gi"
```

---

# 16. Install Argo CD

```
kubectl create namespace argocd
```

```
kubectl apply-n argocd--server-side--force-conflicts-f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Argo CD’s official getting-started guide uses this installation approach and recommends pinning a version for production.

Access UI locally:

```
kubectl port-forward svc/argocd-server-n argocd8080:443
```

Open:

```
https://localhost:8080
```

Get initial password:

```
kubectl-n argocdget secret argocd-initial-admin-secret \
-ojsonpath="{.data.password}" | base64-d
```

Windows PowerShell:

```
$password=kubectl-nargocdgetsecretargocd-initial-admin-secret-ojsonpath="{.data.password}"
[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($password))
```

---

# 17. Argo CD Application Example

`argocd/ticket-api-dev.yaml`

```
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: ticket-api-dev
  namespace: argocd
spec:
  project: default

  source:
    repoURL: https://github.com/company/deployment-repo.git
    targetRevision: main
    path: apps/ticket-api
    helm:
      valueFiles:
        - ../../environments/dev/ticket-api-values.yaml

  destination:
    server: https://kubernetes.default.svc
    namespace: ticket-dev

  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

Apply:

```
kubectl apply-f argocd/ticket-api-dev.yaml
```

Argo CD supports Helm charts and can automatically deploy the desired application state from Git into Kubernetes.

---

# 18. Full Deployment Flow

```
Step 1: Developer commits code
Step 2: CI pipeline builds Docker image
Step 3: CI pushes image to Nexus
Step 4: CI updates Helm values image tag
Step 5: Git change is merged
Step 6: Argo CD detects Git change
Step 7: Argo CD applies Helm chart to Kubernetes
Step 8: Kubernetes creates/updates Pods
Step 9: Service sends traffic to healthy Pods
Step 10: Ingress exposes app to users
Step 11: HPA scales Pods when load increases
```

---

# 19. Example CI Pipeline Logic

Pseudo pipeline:

```
build application
run tests
build Docker image
push image to Nexus
update Helm values image tag
commit updated values file
Argo CD deploys automatically
```

Example shell:

```
IMAGE_TAG=1.0.1

docker build-t nexus.company.com/ticket-api:$IMAGE_TAG .
docker push nexus.company.com/ticket-api:$IMAGE_TAG

sed-i"s/tag: .*/tag: \"$IMAGE_TAG\"/" environments/dev/ticket-api-values.yaml

git add environments/dev/ticket-api-values.yaml
git commit-m"Deploy ticket-api$IMAGE_TAG to dev"
git push
```

macOS may need:

```
sed-i''"s/tag: .*/tag: \"$IMAGE_TAG\"/" environments/dev/ticket-api-values.yaml
```

PowerShell:

```
$imageTag="1.0.1"

dockerbuild-tnexus.company.com/ticket-api:$imageTag .
dockerpushnexus.company.com/ticket-api:$imageTag

(Get-Contentenvironments/dev/ticket-api-values.yaml) `
-replace'tag: .*',"tag: `"$imageTag`""|
Set-Contentenvironments/dev/ticket-api-values.yaml

gitaddenvironments/dev/ticket-api-values.yaml
gitcommit-m"Deploy ticket-api$imageTag to dev"
gitpush
```

---

# 20. Real-World Scenario

## Normal Day

```
Users: 100
Pods: 2
CPU: 35%
HPA: no scaling needed
```

## Ticket Sale Starts

```
Users: 50,000
CPU: 85%
HPA: increases Pods from 2 to 10
Service: balances traffic across all Pods
Users: still access same domain
```

## Sale Ends

```
Users: 500
CPU: 20%
HPA: reduces Pods from 10 to 2
Company saves resources
```

---

# 21. Useful Debug Commands

```
kubectlget pods-n ticket-dev
kubectl describe pod POD_NAME-n ticket-dev
kubectl logs POD_NAME-n ticket-dev
kubectlget events-n ticket-dev--sort-by=.metadata.creationTimestamp
kubectlget deployment-n ticket-dev
kubectlget hpa-n ticket-dev
kubectl describe hpa ticket-api-n ticket-dev
```

Argo CD:

```
argocd app list
argocd appget ticket-api-dev
argocd app sync ticket-api-dev
argocd app rollback ticket-api-dev
```

Helm:

```
helm list-n ticket-dev
helm history ticket-api-n ticket-dev
helm rollback ticket-api1-n ticket-dev
```

---

# 22. Production Checklist

```
[ ] Image stored in trusted registry
[ ] Image tag is fixed, not latest
[ ] Resource requests and limits are configured
[ ] Health checks are configured
[ ] HPA is enabled
[ ] Ingress uses HTTPS/TLS
[ ] Secrets are not stored as plain text in Git
[ ] Argo CD auto-sync is reviewed carefully for production
[ ] Monitoring is enabled
[ ] Logs are centralized
[ ] Rollback process is tested
[ ] Namespace is separated per environment
[ ] RBAC permissions are limited
[ ] Network policies are considered
```

---

# 23. Best Practice Summary

```
Use Docker image tags like 1.0.0, not latest.
Keep Kubernetes YAML in Git.
Use Helm to avoid duplicate YAML.
Use Argo CD to deploy from Git automatically.
Use HPA to scale during traffic spikes.
Use Ingress for public access.
Use Secrets for passwords.
Use separate values files for dev, staging, and production.
```

---

# 24. Beginner Mental Model

```
Docker image = packaged application
Nexus = image storage
Helm chart = installation recipe
values.yaml = environment settings
Argo CD = automatic deployer
Kubernetes = runtime platform
Pod = running app
Service = stable internal address
Ingress = public entry point
HPA = automatic scaler
```

Final flow:

```
Image in Nexus
   +
Helm chart in Git
   +
Argo CD watching Git
   =
Automated Kubernetes deployment
```