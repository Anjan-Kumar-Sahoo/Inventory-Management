# 🤖 Agent Intelligence & Context (Agents.md)

This document serves as the primary source of truth for AI agents interacting with this repository. It provides a comprehensive overview of the system architecture, design philosophy, and implementation status.

---

## 🚀 Project Overview: "Next-Gen Inventory Command Center"
This is a high-performance Inventory Management System designed to bridge the gap between complex logistics and premium user experience. It uses a Spring Boot backend and a React (Vite/TypeScript) frontend.

### 🛠️ Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion.
- **Backend**: Java 17, Spring Boot, Spring Data JPA, MySQL, Flyway (Migration).
- **Security**: Spring Security, JWT (Bearer Token), BCrypt, Email OTP.
- **Design Tools**: Stitch (Project ID: `15072817964032502010`).

---

## 🌌 Design Philosophy: "Neon-Glass Methodology"
We have moved away from traditional spreadsheet-link designs. The system now follows a "Ethereal Command Center" aesthetic.

### 💎 Core Tokens
- **Background**: `surface` #0F131F (Deep Space).
- **Primary**: `primary` #CDBDFF (Luminous Violet).
- **Accents**: `secondary` #BDF4FF (Neon Cyan), `tertiary` #FFABF3 (Neon Magenta).
- **Light Theme Accent Mapping**: darkened accent variants are enforced for readability (`purple` #5B21B6, `blue` #0E7490, `pink` #9D174D, `yellow/warning` #854D0E).
- **Core Aesthetic**: 
  - **Glassmorphism**: Semi-transparent cards (`backdrop-blur: 20px`).
  - **Luminous Depth**: Using glowing box-shadows instead of standard black shadows.
  - **Asymmetry**: Wide spacing and oversized editorial headers.

---

## 🏗️ Architecture & Key Components

### 🖥️ Frontend (React)
- **Root**: `src/App.tsx` (Provider composition only).
- **Routing Layer**:
  - `src/routes/AppRoutes.tsx`: Central route tree for guest/protected navigation.
  - `src/routes/paths.ts`: Route constants + tab/path mapping.
  - `src/routes/RouteGuards.tsx`: Auth-based guest/protected guards.
- **Layout Layer**:
  - `src/layouts/AppShell.tsx`: Protected app chrome (Header, Outlet, Footer).
  - `src/components/layout/Header.tsx`: Solid top navigation bar for improved readability.
- **Hooks**:
  - `src/hooks/useTheme.ts`: Global theme state + persistence.
- **Design Tokens**:
  - `src/index.css`: Base tokens + light-mode accent overrides for hardcoded Tailwind color utilities.
- **Contexts**:
  - `AuthContext`: Manages JWT sessions, user info, and authentication state.
  - `InventoryContext`: Manages products, suppliers, and sales data.
- **Key Pages**:
  - `Dashboard.tsx`: Overview with key metrics.
  - `ProductManager.tsx`: Full CRUD for products.
  - `SupplierManager.tsx`: Full CRUD for suppliers.
  - `SellProduct.tsx`: Transaction-focused interface.
  - `auth/`: Contains Login, Register, and OTP verification logic.

### ⚙️ Backend (Spring Boot)
- **Base Package**: `com.yourcompany.inventory`
- **Key Modules**:
  - `entity/`: Product, Supplier, User, Otp.
  - `controller/`: REST endpoints for all entities.
  - `service/`: Business logic (OTP generation, sale processing).
  - `security/`: JWT filtering and authentication configuration.

---

## 🛠️ System Hardening & Reliability

### 💎 Atomic Inventory Transactions
We use atomic SQL updates for stock management to prevent race conditions during high-volume sales.
- **Atomic Decrement**: `ProductRepository.decrementStock` ensures stock only decreases if sufficient quantity exists, preventing "Double Sell" scenarios.
- **Optimized Profit Tracking**: The system maintains an incremental `ProfitRecord` rather than re-calculating the entire sales history, ensuring O(1) performance for profit reporting.

---

## 📍 Implementation Status & History

### 📅 Phase 1: Conceptualization & Design (Completed)
- [x] Analyze existing codebase and README.
- [x] Create Stitch project and define "Next-Gen" design system.
- [x] Generate UI mocks for Dashboard, Products, Suppliers, and Auth.
- [x] Create `Agents.md` for context persistence.

### 📅 Phase 2: Frontend Implementation (Completed)
- [x] Implement global CSS variables for Neon-Glass tokens in `index.css`.
- [x] Update `App.tsx` shell with fixed glassmorphic navigation and ambient glows.
- [x] Refactor Dashboard with mission-control stat cards and high-impact headers.
- [x] Refactor Product & Supplier modules with holographic table interfaces.
- [x] Complete Auth overhaul (Login, Register, OTP) with futuristic "Infinite Flow" branding.

### 📅 Phase 3: Frontend Architecture Hardening (Completed)
- [x] Extract centralized route tree into `src/routes/AppRoutes.tsx`.
- [x] Add explicit route constants and tab mapping in `src/routes/paths.ts`.
- [x] Move guest/protected rules into reusable `src/routes/RouteGuards.tsx`.
- [x] Move protected app chrome into `src/layouts/AppShell.tsx`.
- [x] Extract theme state persistence and DOM sync into `src/hooks/useTheme.ts`.

### 📅 Phase 4: Light Theme Contrast Calibration (Completed)
- [x] Darken light-theme blue, yellow, pink, and purple accents for readability.
- [x] Add centralized light-mode overrides in `src/index.css` for text/background/border/ring/gradient Tailwind utility classes.
- [x] Preserve dark-theme neon styling while applying overrides only under `:root.light`.

### 📅 Phase 5: Dashboard Dark Theme Polish (Completed)
- [x] Convert dashboard profit and low-stock cards to theme-variable surfaces (no hardcoded white cards in dark mode).
- [x] Make header navigation solid for stronger visual stability.
- [x] Update footer copy to: "Godamm - Made in Love  - An Inventory Management System".

---

## 📝 Agent Instructions for Modification
1. **Preserve Context**: Always read `Agents.md` before starting a task.
2. **Sync Updates**: If you add new pages, backend entities, or change the design system, **YOU MUST** update the "Architecture" and "Status" sections of this file immediately.
3. **Aesthetics First**: Never implement a basic UI. Always aim for the "Wowed" factor using the tokens defined here.
4. **Clean Code**: maintain TypeScript types and descriptive variable names.
