# Multi-Vendor System Architecture

### System Overview

A scalable multi-vendor e-commerce backend built with **Nest.js** framework, designed to support complex business operations with robust security and modular architecture.
The system serves three distinct user roles with comprehensive feature sets for real-world e-commerce operations.

> **Status:** This repository is actively under development. Some sections are temporarily commented out while implementation is in progress.

### Principal Sponsors

<table cellpadding="8" cellspacing="0" style="border:1px solid #e6edf3;border-radius:10px;padding:12px;">
  <tr>
    <td align="center" style="vertical-align:middle;">
      <a href="https://nestjs.com" target="_blank" rel="noopener noreferrer">
        <img src="https://cdn.simpleicons.org/nestjs" width="64" alt="NestJS" style="vertical-align:middle;">
      </a>
    </td>
    <td align="center" style="vertical-align:middle;">
      <a href="https://www.postgresql.org" target="_blank" rel="noopener noreferrer">
        <img src="https://cdn.simpleicons.org/postgresql" width="64" alt="PostgreSQL" style="vertical-align:middle;">
      </a>
    </td>
    <td align="center" style="vertical-align:middle;">
      <a href="https://www.typescriptlang.org" target="_blank" rel="noopener noreferrer">
        <img src="https://cdn.simpleicons.org/typescript" width="64" alt="TypeScript" style="vertical-align:middle;">
      </a>
    </td>
    <td align="center" style="vertical-align:middle;">
      <a href="https://www.prisma.io" target="_blank" rel="noopener noreferrer">
        <img src="https://cdn.simpleicons.org/prisma" width="64" alt="Prisma" style="vertical-align:middle;">
      </a>
    </td>
    <td align="center" style="vertical-align:middle;">
      <a href="https://resend.com" target="_blank" rel="noopener noreferrer">
        <img src="https://cdn.simpleicons.org/resend" width="64" alt="Resend" style="vertical-align:middle;">
      </a>
    </td>
    <td align="center" style="vertical-align:middle;">
      <a href="https://aws.amazon.com/s3/" target="_blank" rel="noopener noreferrer">
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Amazon-S3-Logo.svg" width="64" alt="AWS S3" style="vertical-align:middle;">
      </a>
    </td>
    <td align="center" style="vertical-align:middle;">
      <a href="https://redis.io" target="_blank" rel="noopener noreferrer">
        <img src="https://cdn.simpleicons.org/redis" width="64" alt="Redis" style="vertical-align:middle;">
      </a>
    </td>
    <td align="center" style="vertical-align:middle;">
      <a href="https://docs.bullmq.io" target="_blank" rel="noopener noreferrer">
        <!-- upload assets/logos/bullmq.svg then this jsDelivr link will work -->
        <img src="https://user-images.githubusercontent.com/95200/143832033-32e868df-f3b0-4251-97fb-c64809a43d36.png" width="150" alt="BullMQ" style="vertical-align:middle;">
      </a>
    </td>
    <td align="center" style="vertical-align:middle;">
      <a href="https://sepay.vn" target="_blank" rel="noopener noreferrer">
        <!-- upload assets/logos/sepay.svg then this jsDelivr link will work -->
        <img src="https://sepay.vn//assets/img/logo/sepay-blue-154x50.png" width="150" alt="Sepay" style="vertical-align:middle;">
      </a>
    </td>
  </tr>
</table>

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
