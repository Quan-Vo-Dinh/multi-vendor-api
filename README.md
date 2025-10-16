# Multi-Vendor System Architecture

### System Overview

A scalable multi-vendor e-commerce backend built with **Nest.js** framework, designed to support complex business operations with robust security and modular architecture.
The system serves three distinct user roles with comprehensive feature sets for real-world e-commerce operations.

> **Status:** This repository is actively under development. Some sections are temporarily commented out while implementation is in progress.

### Principal Sponsors
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)](https://resend.com/)
[![AWS S3](https://img.shields.io/badge/AWS%20S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)](https://aws.amazon.com/s3/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![BullMQ](https://img.shields.io/badge/BullMQ-E02020?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://docs.bullmq.io/)
[![Sepay](https://img.shields.io/badge/Sepay-0078FF?style=for-the-badge&logo=paypal&logoColor=white)](https://sepay.vn/)
---

### Role-Based System Architecture

#### Core User Roles & Capabilities

```mermaid
graph TB
    subgraph PLATFORM["E-commerce Platform"]
        ADMIN["Admin User<br/>System Management"]
        SELLER["Seller Vendor<br/>Store Management"]
        CUSTOMER["Customer<br/>Shopping Experience"]
    end

    subgraph ADMIN_FEATURES["Admin Capabilities"]
        A1["User Management"]
        A2["Role & Permission Control"]
        A3["Platform Analytics"]
        A4["System Configuration"]
    end

    subgraph SELLER_FEATURES["Seller Capabilities"]
        S1["Product Catalog"]
        S2["Sales Analytics"]
        S3["Customer Management"]
        S4["Revenue Tracking"]
    end

    subgraph CUSTOMER_FEATURES["Customer Capabilities"]
        C1["Product Browsing"]
        C2["Order Management"]
        C3["Review System"]
        C4["Messaging"]
    end

    ADMIN --> ADMIN_FEATURES
    SELLER --> SELLER_FEATURES
    CUSTOMER --> CUSTOMER_FEATURES

    style ADMIN fill:#2d3436,stroke:#636e72,color:#ffffff
    style SELLER fill:#636e72,stroke:#b2bec3,color:#ffffff
    style CUSTOMER fill:#b2bec3,stroke:#2d3436,color:#000000
```

---

### Security & Authentication Architecture

#### Multi-Layer Security Implementation

```mermaid
graph BR
    subgraph SECURITY_LAYER["Security Stack"]
        A1["JWT Token System"]
        A2["Device Session Tracking"]
        A3["Two-Factor Authentication"]
        A4["RBAC Permission Control"]
    end

    subgraph AUTH_FLOW["Authentication Flow"]
        B1["Login Request"]
        B2["Credential Validation"]
        B3["Token Generation"]
        B4["Device Registration"]
        B5["2FA Verification"]
    end

    subgraph ACCESS_CONTROL["Access Management"]
        C1["Permission Verification"]
        C2["Role-Based Routing"]
        C3["Token Refresh"]
        C4["Activity Logging"]
    end

    SECURITY_LAYER --> AUTH_FLOW
    AUTH_FLOW --> ACCESS_CONTROL

    style SECURITY_LAYER fill:#2d3436,stroke:#636e72,color:#ffffff
    style AUTH_FLOW fill:#636e72,stroke:#b2bec3,color:#ffffff
    style ACCESS_CONTROL fill:#b2bec3,stroke:#2d3436,color:#000000
```

#### Key Security Features

- **Token-based Authentication**: Access & Refresh token system with configurable expiration
- **Device Management**: Track and manage active sessions across multiple devices
- **2FA Support**: TOTP-based two-factor authentication for enhanced security
- **Role-Based Access Control**: Granular permissions for different user types
- **Session Security**: Automatic device fingerprinting and suspicious activity detection

---

### Product Management System

#### Multi-Vendor Catalog Architecture

> **Note:** This feature is currently under development.

---

### Order & Payment Processing

> **Note:** This feature is currently under development.

---

### Notification & Messaging System

> **Note:** This feature is currently under development.

---

### Database Architecture

![Database Diagram](https://raw.githubusercontent.com/quan-vo-dinh/multi-vendor-api/main/database/multi-vendor-database.svg)

#### Key Components

- **User Management**: Multi-role user system with authentication tracking
- **Product Catalog**: Vendor-based product structure with variants and stock
- **Order Processing**: Full lifecycle management with payment integration
- **Multi-language Support**: Translation system for localization
- - **Analytics & Reporting**: Data tracking for business intelligence

> **Detailed DB docs:** For the full, interactive database schema, table descriptions, and ER diagrams, please refer to the project DB documentation hosted on dbdocs: https://dbdocs.io/vodinhquan2707.it/multi-vendor

---
