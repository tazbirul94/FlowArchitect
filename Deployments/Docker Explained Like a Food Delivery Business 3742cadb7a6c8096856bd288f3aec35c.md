# Docker Explained Like a Food Delivery Business

ENTRYPOINT [“java”,“-jar”,“app.jar”]

---

# Chapter 12: Multi-Stage Builds

Builder Stage
↓
Compile
↓
Final Runtime Image

Smaller Images
Faster Deployments

---

# Chapter 13: Docker Compose

services:
frontend:
backend:
mysql:

docker compose up -d

---

# Chapter 14: Nexus

Developer
↓
Build Image
↓
Push Nexus
↓
Deploy

docker login nexus.company.com

docker push nexus.company.com/app:1.0.0

---

# Chapter 15: CI/CD

Git Push
↓
Build
↓
Test
↓
Docker Build
↓
Push Registry
↓
Deploy

Tools:

- GitHub Actions
- GitLab CI
- Jenkins
- Azure DevOps

---

# Chapter 16: Security

Best Practices:

- Do not run as root
- Scan images
- Use fixed versions
- Use minimal base images

---

# Chapter 17: Production Best Practices

- Health Checks
- Logging
- Monitoring
- Resource Limits
- Versioned Tags

Never use latest in production.

---

# Chapter 18: Monitoring

Tools:

- Prometheus
- Grafana
- ELK Stack

Metrics:

- CPU
- Memory
- Network
- Errors

---

# Chapter 19: Troubleshooting

docker logs container

docker exec -it container bash

docker inspect container

---

# Chapter 20: Docker to Kubernetes

Docker
↓
Image
↓
Registry
↓
Kubernetes Pod
↓
Service
↓
Ingress

---

# Chapter 21: Interview Questions

1. Difference between Image and Container?
2. What is a Volume?
3. What is a Network?
4. What is Docker Compose?
5. Explain Multi-Stage Builds.

---

# Chapter 22: Hands-On Labs

Lab 1:
Run Nginx

Lab 2:
Build Java Application Image

Lab 3:
Create Docker Compose Stack

Lab 4:
Push Image to Nexus

Lab 5:
Deploy to Kubernetes

---

# Next Step

After completing this handbook:

Docker
→ Docker Compose
→ Nexus
→ Kubernetes
→ Helm
→ Argo CD
→ GitOps

Imagine you own a restaurant.

Your application is the food.

---

## Before Docker

Suppose you cook food in your own kitchen.

```
My Kitchen
 ├── My Stove
 ├── My Oven
 ├── My Ingredients
 └── My Recipe
```

Food tastes great.

Now you send the recipe to another restaurant.

```
Other Kitchen
 ├── Different Stove
 ├── Different Oven
 ├── Different Ingredients
 └── Same Recipe
```

Food tastes different.

Same recipe.

Different environment.

---

This is exactly what happens in software.

Developer machine:

```
Java 21
Node 22
Redis
MySQL
Ubuntu
```

Production server:

```
Java 17
Node 18
Redis missing
Different Linux
```

Application breaks.

---

Developer says:

```
"It works on my machine."
```

Operations team says:

```
"It doesn't work here."
```

Everyone is unhappy.

---

# Docker's Idea

Instead of sending only the recipe...

Send the ENTIRE KITCHEN.

```
Application
+
Java
+
Libraries
+
Dependencies
+
Configurations
+
Runtime
```

Pack everything into one box.

```
┌──────────────────┐
│ Docker Image     │
└──────────────────┘
```

Now every kitchen receives the exact same box.

Result:

```
Works everywhere.
```

---

# Docker Image vs Container

Most beginners confuse these.

Let's use a house example.

---

## Blueprint

```
┌─────────────┐
│ House Plan  │
└─────────────┘
```

This is:

```
Docker Image
```

---

## Actual House

```
┌─────────────┐
│ Real House  │
└─────────────┘
```

This is:

```
Docker Container
```

---

Image:

```
Blueprint
```

Container:

```
Running thing
```

---

Example

Image:

```
nginx:1.27
```

Run:

```
docker run nginx
```

Container created:

```
container-123
```

---

Think:

```
Image = Class

Container = Object
```

If you're a Java developer.

---

# Real Company Story

Imagine Eventim.

Users buy tickets.

You have:

```
Ticket API
Payment API
User API
Notification API
```

Without Docker:

```
Server 1
Java 17

Server 2
Java 21

Server 3
Java 11

Server 4
Missing Library
```

Nightmare.

---

With Docker:

```
Ticket API Image
Payment API Image
User API Image
Notification API Image
```

All packaged.

Every server gets identical software.

---

# Docker Architecture

Think of Docker as a factory.

```
                Docker Factory

                     │
                     ▼

┌──────────────────────────────┐
│ Docker Engine                │
└──────────────────────────────┘

        │                 │

        ▼                 ▼

 Docker Images      Docker Containers
```

---

Developer commands:

```
docker build
docker run
dockerstop
```

are requests to the factory.

---

# What Happens During Docker Build?

Suppose we have:

```
FROM ubuntu

COPY app.jar .

CMD java -jar app.jar
```

---

Docker performs:

```
Step 1
Download Ubuntu

        ↓

Step 2
Copy app.jar

        ↓

Step 3
Create image

        ↓

Done
```

---

Visual:

```
┌─────────────┐
│ Ubuntu      │
└──────┬──────┘
       │

       ▼

┌─────────────┐
│ app.jar     │
└──────┬──────┘
       │

       ▼

┌─────────────┐
│ Docker Img  │
└─────────────┘
```

---

# What Happens During docker run?

You run:

```
docker run ticket-api
```

Docker:

```
Find image

      ↓

Create container

      ↓

Start process

      ↓

Application running
```

Visual:

```
Docker Image

┌────────────────┐
│ ticket-api     │
└───────┬────────┘
        │

        ▼

┌────────────────┐
│ Container      │
│ Running JVM    │
└────────────────┘
```

---

# Why Ports Are Needed

Imagine your house.

You have a door.

Without a door:

```
Nobody can enter.
```

---

Container:

```
Application
Running
```

But hidden.

---

Browser:

```
localhost:8080
```

cannot reach it.

---

We create a door.

```
docker run-p8080:80 nginx
```

Meaning:

```
Outside World
     │

8080
     │

     ▼

Container
Port 80
```

Visual:

```
Browser

   │

8080

   │

   ▼

┌─────────────────┐
│ Docker Host     │
└────────┬────────┘
         │

         ▼

┌─────────────────┐
│ NGINX Container │
│ Port 80         │
└─────────────────┘
```

---

# Why Volumes Exist

Imagine a database.

```
docker run mysql
```

Create users.

Insert records.

Everything works.

---

Now delete container.

```
dockerrm mysql
```

Data gone.

---

Because containers are temporary.

Think:

```
Hotel Room
```

Not:

```
Permanent House
```

---

Solution:

Volumes.

```
docker volume create mysql-data
```

Attach:

```
docker run \
-v mysql-data:/var/lib/mysql \
mysql
```

Visual:

```
           Container

      ┌──────────────┐
      │ MySQL        │
      └──────┬───────┘
             │

             ▼

      ┌──────────────┐
      │ Volume       │
      │ mysql-data   │
      └──────────────┘
```

Delete container?

```
Volume survives.
```

Data safe.

---

# Why Networks Exist

Let's say:

```
Frontend
Backend
Database
```

Need communication.

---

Without network:

```
Frontend ❌ Backend
Backend ❌ Database
```

---

Create network:

```
docker network create app-network
```

Now:

```
Frontend
    │
    ▼
Backend
    │
    ▼
Database
```

---

Real visualization:

```
            app-network

┌─────────┐
│Frontend │
└────┬────┘
     │

┌────▼────┐
│ Backend │
└────┬────┘
     │

┌────▼────┐
│ MySQL   │
└─────────┘
```

---

# Why Docker Compose Exists

Imagine starting:

```
Frontend
Backend
Redis
MySQL
Kafka
```

One by one.

```
docker run ...
docker run ...
docker run ...
docker run ...
docker run ...
```

Painful.

---

Docker Compose is like an orchestra conductor.

One file controls everything.

```
services:

  frontend:
    image: frontend

  backend:
    image: backend

  mysql:
    image: mysql

  redis:
    image: redis
```

Start:

```
docker compose up
```

Everything starts.

---

Visual:

```
               Compose

                   │

    ┌──────────────┼──────────────┐

    ▼              ▼              ▼

Frontend        Backend        MySQL
                                  │
                                  ▼
                               Redis
```

---

# How Big Companies Use Docker

Imagine Eventim Ticket System.

```
Ticket Service
Payment Service
User Service
Email Service
```

Each becomes:

```
ticket-service:1.0

payment-service:1.0

user-service:1.0

email-service:1.0
```

Stored in Nexus.

```
                Nexus

                   │

    ┌──────────────┼──────────────┐

    ▼              ▼              ▼

Ticket API     Payment API    User API
```

---

Deployment:

```
Developer

    │

    ▼

Git Push

    │

    ▼

CI/CD Pipeline

    │

    ▼

Docker Build

    │

    ▼

Push To Nexus

    │

    ▼

Kubernetes

    │

    ▼

Users
```

---

# Why Kubernetes Comes After Docker

Docker solves:

```
Packaging
```

Kubernetes solves:

```
Running
Scaling
Healing
Load Balancing
```

Think:

```
Docker
=
Food Package
```

```
Kubernetes
=
Delivery Company
```

---

# Ultimate Beginner Mental Model

Whenever you see Docker, think:

```
Source Code

      │

      ▼

Dockerfile

      │

      ▼

Docker Build

      │

      ▼

Docker Image

      │

      ▼

Docker Registry
(Nexus)

      │

      ▼

Docker Container

      │

      ▼

Docker Compose

      │

      ▼

Kubernetes

      │

      ▼

Production
```

And remember this one sentence:

> **Docker's job is to package an application and everything it needs into a portable box that runs exactly the same everywhere.**
> 

That's the foundation upon which Helm, Argo CD, Kubernetes, Nexus, CI/CD, and modern cloud platforms are built.