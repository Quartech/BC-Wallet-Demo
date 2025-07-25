# Development Guide for Helm Charts

## Table of Contents

1. [Local Setup](#local-setup)
   - [Using Docker Desktop Cluster with Minikube](#using-docker-desktop-cluster-with-minikube)
2. [Azure and ACR](#azure-and-acr)
   - [Authenticate and Pull Images](#authenticate-and-pull-images)

## Local Setup

### Using Docker Desktop Cluster with Minikube

0. **Push Image to Local Docker Registry**
   ```sh
   cd credential-manager
   docker build -t <your-docker-username>/credential-manager -f ./.docker/Dockerfile.prod ./app
   docker push <your-docker-username>/credential-manager
   ```
   - note: update local image registry
1. **Install Minikube**: Follow the [official Minikube installation guide](https://minikube.sigs.k8s.io/docs/start/).
   - note: [Headlamp](https://headlamp.dev/) is a great kube viewer.
2. **Start Minikube**:
   ```sh
   minikube start --driver=docker
   ```
   - note: Make sure to run minikube from PCs main environment. ie. not wsl
3. **Switch Context**
   ```sh
   kubectl config use-context <context_name>
   ```
4. **Switch Namespace**
   ```sh
   kubectl config set-context --current --namespace=<your-azure-namespace>
   ```
   **Create Namespace**
   ```sh
   kubectl create namespace <your-azure-namespace>
   ```
5. **Deploy Helm Chart**:
   ```sh
   helm install my-release ./path-to-your-chart
   ```
6. **Update a Secret**
   ```sh
   kubectl edit secrets <secret-name>
   ```
   - note: make sure to encode the secret in base64 to save properly.
   - secrets ts-app: ['qts-tenant-secret','qts-keycloak-secret','qts-webhook-secret']

## Azure and ACR

### Authenticate and Pull Images

1. **Login to Azure**:
   ```sh
   az login
   ```
2. **Set Subscription**:
   ```sh
   az account set --subscription <your-subscription-id>
   ```
3. **Login to ACR**:
   ```sh
   az acr login --name <your-acr-name>
   ```
4. **Login to ACR With Docker**:
   ```sh
   docker login -u <your-acr-token> -p <your-acr-password> <your-acr-name>.azurecr.io
   ```
5. **Pull Image from ACR**:
   ```sh
   docker pull <your-acr-name>.azurecr.io/<your-image>:<tag>
   ```
6. **Push Image to ACR**:
   ```sh
   docker push <your-acr-name>.azurecr.io/<your-image>:<tag>
   ```

Feel free to add more patterns and commands as needed for your development workflow.

<!--
Commands:

kubectl config use-context docker-desktop
kubectl create namespace showcase
kubectl config set-context --current --namespace=showcase

docker build -t kjartaneinarsson/bc-wallet-demo-server -f ./apps/bc-wallet-demo-server/Dockerfile .
docker push kjartaneinarsson/bc-wallet-demo-server

docker build -t kjartaneinarsson/bc-wallet-demo-web -f ./apps/bc-wallet-demo-web/Dockerfile .
docker push kjartaneinarsson/bc-wallet-demo-web

docker build -t kjartaneinarsson/bc-wallet-traction-adapter -f ./apps/bc-wallet-traction-adapter/Dockerfile .
docker push kjartaneinarsson/bc-wallet-traction-adapter

docker build -t kjartaneinarsson/bc-wallet-api-server -f ./apps/bc-wallet-api-server/Dockerfile .
docker push kjartaneinarsson/bc-wallet-api-server

docker build -t kjartaneinarsson/bc-wallet-showcase-creator -f ./apps/bc-wallet-showcase-creator/Dockerfile .
docker push kjartaneinarsson/bc-wallet-showcase-creator

helm install --dry-run showcase-manager ./charts/bc-wallet/ --namespace showcase --set demoServer.image.repository=kjartaneinarsson/bc-wallet-demo-server --set demoWeb.image.repository=kjartaneinarsson/bc-wallet-demo-web --set tractionAdapter.image.repository=kjartaneinarsson/bc-wallet-traction-adapter --set apiServer.image.repository=kjartaneinarsson/bc-wallet-api-server --set showcaseCreator.image.repository=kjartaneinarsson/bc-wallet-showcase-creator

helm upgrade --install showcase-manager ./charts/bc-wallet/ --namespace showcase --set demoServer.image.repository=kjartaneinarsson/bc-wallet-demo-server --set demoWeb.image.repository=kjartaneinarsson/bc-wallet-demo-web --set tractionAdapter.image.repository=kjartaneinarsson/bc-wallet-traction-adapter --set apiServer.image.repository=kjartaneinarsson/bc-wallet-api-server --set showcaseCreator.image.repository=kjartaneinarsson/bc-wallet-showcase-creator


kubectl config use-context aks-sharedaks-cnc-cluster
kubectl config set-context --current --namespace=showcase



kubectl create secret generic bc-wallet \  
--from-file=./charts/secrets.yaml

kubectl apply -f ./charts/secrets.yaml
-->
