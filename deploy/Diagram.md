# BC Wallet Demo System Architecture

This document contains multiple focused diagrams showing different aspects of the BC Wallet Demo system architecture.

## System Components

### Frontend Applications (2 containers)

- **bc-wallet-demo-web** (Port 5002) - React-based demo wallet UI
- **bc-wallet-showcase-creator** (Port 5003) - Next.js admin interface

### Backend Services (3 containers)

- **bc-wallet-api-server** (Port 5005) - Core REST API
- **bc-wallet-demo-server** (Port 5004) - Demo-specific backend
- **bc-wallet-traction-adapter** (Port 3000) - Traction integration adapter

### Infrastructure Services (2 containers)

- **PostgreSQL** (Port 5432) - Primary database
- **RabbitMQ** (Port 5672) - Message broker

### External Services (2 services)

- **Keycloak** - OIDC authentication provider
- **Traction** - Hyperledger Indy/Aries credential platform

## 1. High-Level System Overview

This diagram shows the main components and their relationships at a high level.

```mermaid
graph TB
    %% User Interfaces
    subgraph "User Interfaces"
        DW[Demo Wallet UI<br/>Port: 5002]
        SC[Showcase Creator<br/>Port: 5003]
    end

    %% Core Services
    subgraph "Core Services"
        AS[API Server<br/>Port: 5005]
        DS[Demo Server<br/>Port: 5004]
    end

    %% External Systems
    subgraph "External Systems"
        KC[Keycloak<br/>Authentication]
        TR[Traction<br/>Credential Platform]
    end

    %% Connections
    DW --> DS
    DW --> AS
    SC --> AS
    DS --> TR
    AS --> KC
    SC --> KC

    %% Styling
    classDef ui fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000000
    classDef service fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000000
    classDef external fill:#ffebee,stroke:#d32f2f,stroke-width:2px,color:#000000

    class DW,SC ui
    class AS,DS service
    class KC,TR external
```

## 2. Container Services & Infrastructure

This diagram focuses on the internal Docker containers and infrastructure components.

```mermaid
graph TB
    %% Frontend Containers
    subgraph "Frontend Containers"
        DW[bc-wallet-demo-web<br/>React App<br/>Port: 5002]
        SC[bc-wallet-showcase-creator<br/>Next.js App<br/>Port: 5003]
    end

    %% Backend Containers
    subgraph "Backend Containers"
        AS[bc-wallet-api-server<br/>REST API<br/>Port: 5005]
        DS[bc-wallet-demo-server<br/>Demo Backend<br/>Port: 5004]
        TA[bc-wallet-traction-adapter<br/>Message Consumer<br/>Port: 3000]
    end

    %% Infrastructure
    subgraph "Infrastructure"
        PG[(PostgreSQL<br/>Database<br/>Port: 5432)]
        RMQ[RabbitMQ<br/>Message Broker<br/>Port: 5672]
    end

    %% Internal Connections
    DW --> DS
    DW --> AS
    SC --> AS
    AS --> PG
    AS --> RMQ
    TA --> RMQ
    TA --> AS

    %% Styling
    classDef frontend fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000000
    classDef backend fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000000
    classDef infra fill:#e8f5e8,stroke:#388e3c,stroke-width:2px,color:#000000

    class DW,SC frontend
    class AS,DS,TA backend
    class PG,RMQ infra
```

## 3. External Service Integrations

This diagram shows how the system connects to external services.

```mermaid
graph LR
    %% Internal Services
    subgraph "BC Wallet Stack"
        AS[API Server]
        SC[Showcase Creator]
        DS[Demo Server]
        TA[Traction Adapter]
        DW[Demo Web UI]
    end

    %% External Services
    KC[Keycloak<br/>OIDC Provider<br/>Authentication]
    TR[Traction<br/>ACA-Py Platform<br/>Credential Operations]
    SP[Snowplow Analytics<br/>Usage Tracking]

    %% Authentication Flow
    AS -->|OIDC Auth| KC
    SC -->|OIDC Auth| KC

    %% Credential Operations
    DS -->|Direct API| TR
    TA -->|API Calls| TR
    DS <-->|Webhooks| TR

    %% Analytics
    DW -->|Events| SP

    %% Styling
    classDef internal fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000000
    classDef external fill:#ffebee,stroke:#d32f2f,stroke-width:2px,color:#000000

    class AS,SC,DS,TA,DW internal
    class KC,TR,SP external
```

## 4. Data Flow & Message Processing

This diagram shows how data and messages flow through the system for credential operations.

```mermaid
sequenceDiagram
    participant SC as Showcase Creator
    participant AS as API Server
    participant RMQ as RabbitMQ
    participant TA as Traction Adapter
    participant TR as Traction Platform
    participant PG as PostgreSQL

    SC->>AS: Create Credential Schema
    AS->>PG: Save Schema Definition
    AS->>RMQ: Publish "import.cred-schema" message
    RMQ->>TA: Consume message
    TA->>TR: Create Schema in Traction
    TR->>TA: Schema ID response
    TA->>AS: Update schema status
    AS->>PG: Update schema with Traction ID
```

## 5. Authentication & Authorization Flow

This diagram shows how authentication works across the different components.

```mermaid
sequenceDiagram
    participant User as User
    participant SC as Showcase Creator
    participant KC as Keycloak
    participant AS as API Server
    participant PG as PostgreSQL

    User->>SC: Access Showcase Creator
    SC->>KC: Redirect for OIDC Login
    KC->>User: Login Form
    User->>KC: Username/Password
    KC->>SC: Authorization Code
    SC->>KC: Exchange for Access Token
    KC->>SC: JWT Access Token
    SC->>AS: API Call with Bearer Token
    AS->>KC: Validate Token
    KC->>AS: Token Valid + User Info
    AS->>PG: Check Tenant Permissions
    PG->>AS: User Authorized
    AS->>SC: API Response
```

## 6. Credential Issuance & Verification Flow

This diagram shows the end-to-end credential workflow from the demo perspective.

```mermaid
sequenceDiagram
    participant User as Mobile User
    participant DW as Demo Web
    participant DS as Demo Server
    participant TR as Traction
    participant Wallet as Mobile Wallet

    User->>DW: Start Credential Demo
    DW->>DS: Request Credential Offer
    DS->>TR: Create Credential Offer
    TR->>DS: QR Code Data
    DS->>DW: Display QR Code
    DW->>User: Show QR Code
    User->>Wallet: Scan QR Code
    Wallet->>TR: Accept Credential Offer
    TR->>Wallet: Issue Credential
    Wallet->>User: Credential Stored

    Note over User,Wallet: Verification Flow
    User->>DW: Start Verification Demo
    DW->>DS: Request Proof Request
    DS->>TR: Create Proof Request
    TR->>DS: Verification QR Code
    DS->>DW: Display Verification QR
    User->>Wallet: Scan Verification QR
    Wallet->>TR: Submit Proof
    TR->>DS: Proof Verified
    DS->>DW: Verification Success
    DW->>User: Show Success
```

## 7. Multi-Tenant Architecture

This diagram shows how the system supports multiple organizations (tenants) with data isolation.

```mermaid
graph TB
    subgraph "Tenant A - DMV California"
        TA_SC[Showcase Creator A]
        TA_DATA[Tenant A Data<br/>- Schemas<br/>- Credentials<br/>- Users]
    end

    subgraph "Tenant B - Health Authority"
        TB_SC[Showcase Creator B]
        TB_DATA[Tenant B Data<br/>- Schemas<br/>- Credentials<br/>- Users]
    end

    subgraph "Shared Infrastructure"
        AS[API Server<br/>Multi-Tenant Logic]
        PG[(PostgreSQL<br/>Tenant Isolation)]
        KC[Keycloak<br/>Realm Management]
    end

    subgraph "Traction Platform"
        TR_A[Traction Tenant A<br/>Wallet A]
        TR_B[Traction Tenant B<br/>Wallet B]
    end

    TA_SC --> AS
    TB_SC --> AS
    AS --> PG
    AS --> KC

    TA_DATA -.-> PG
    TB_DATA -.-> PG

    AS --> TR_A
    AS --> TR_B

    %% Styling
    classDef tenant fill:#e1f5fe,stroke:#0277bd,stroke-width:2px,color:#000000
    classDef shared fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000000
    classDef traction fill:#ffebee,stroke:#d32f2f,stroke-width:2px,color:#000000

    class TA_SC,TB_SC,TA_DATA,TB_DATA tenant
    class AS,PG,KC shared
    class TR_A,TR_B traction
```

## 8. Deployment Architecture (Kubernetes/OpenShift)

This diagram shows how the system is deployed in a Kubernetes environment.

```mermaid
graph TB
    subgraph "Kubernetes Cluster"
        subgraph "Ingress Layer"
            ING[Ingress Controller<br/>nginx/HAProxy]
        end

        subgraph "Application Pods"
            subgraph "Frontend Pods"
                DW_POD[demo-web-pod<br/>Replicas: 2]
                SC_POD[showcase-creator-pod<br/>Replicas: 2]
            end

            subgraph "Backend Pods"
                AS_POD[api-server-pod<br/>Replicas: 3]
                DS_POD[demo-server-pod<br/>Replicas: 2]
                TA_POD[traction-adapter-pod<br/>Replicas: 2]
            end
        end

        subgraph "Infrastructure Pods"
            PG_POD[postgresql-pod<br/>Replicas: 1<br/>Persistent Volume]
            RMQ_POD[rabbitmq-pod<br/>Replicas: 1<br/>Persistent Volume]
        end

        subgraph "Services"
            DW_SVC[demo-web-service]
            SC_SVC[showcase-creator-service]
            AS_SVC[api-server-service]
            DS_SVC[demo-server-service]
            PG_SVC[postgresql-service]
            RMQ_SVC[rabbitmq-service]
        end

        subgraph "ConfigMaps & Secrets"
            CONFIG[ConfigMaps<br/>- Environment Variables]
            SECRETS[Secrets<br/>- Database Passwords<br/>- API Keys<br/>- TLS Certificates]
        end
    end

    subgraph "External"
        USERS[Users]
        KC_EXT[Keycloak<br/>External Service]
        TR_EXT[Traction<br/>External Service]
    end

    %% Connections
    USERS --> ING
    ING --> DW_SVC
    ING --> SC_SVC
    DW_SVC --> DW_POD
    SC_SVC --> SC_POD

    DW_POD --> DS_SVC
    DW_POD --> AS_SVC
    SC_POD --> AS_SVC

    DS_SVC --> DS_POD
    AS_SVC --> AS_POD

    AS_POD --> PG_SVC
    AS_POD --> RMQ_SVC
    TA_POD --> RMQ_SVC
    TA_POD --> AS_SVC

    PG_SVC --> PG_POD
    RMQ_SVC --> RMQ_POD

    AS_POD --> KC_EXT
    SC_POD --> KC_EXT
    DS_POD --> TR_EXT
    TA_POD --> TR_EXT

    CONFIG -.-> AS_POD
    CONFIG -.-> DS_POD
    CONFIG -.-> TA_POD
    SECRETS -.-> AS_POD
    SECRETS -.-> DS_POD
    SECRETS -.-> TA_POD

    %% Styling
    classDef pod fill:#e8f5e8,stroke:#388e3c,stroke-width:2px,color:#000000
    classDef service fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000000
    classDef external fill:#ffebee,stroke:#d32f2f,stroke-width:2px,color:#000000
    classDef config fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000000

    class DW_POD,SC_POD,AS_POD,DS_POD,TA_POD,PG_POD,RMQ_POD pod
    class DW_SVC,SC_SVC,AS_SVC,DS_SVC,PG_SVC,RMQ_SVC,ING service
    class USERS,KC_EXT,TR_EXT external
    class CONFIG,SECRETS config
```
