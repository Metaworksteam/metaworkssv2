# MetaWorks - Cybersecurity Compliance Platform

## Overview

MetaWorks is a comprehensive SaaS-based cybersecurity compliance platform designed to help organizations achieve and maintain compliance across multiple frameworks including NCA ECC (Saudi National Cybersecurity Authority), SAMA CSF (Saudi Central Bank), ISO 27001, and PDPA (Personal Data Protection Act). The platform features an AI-powered virtual consultant, risk assessment tools, policy management, and real-time compliance scoring with interactive dashboards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool for fast development and optimized production builds
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**UI Components & Styling**
- Tailwind CSS for utility-first styling with custom design tokens
- shadcn/ui component library built on Radix UI primitives
- Custom theme system with dark/light mode support via theme.json configuration
- Professional variant with HSL color system for consistent theming

**State Management**
- React Context for authentication state (AuthContext)
- TanStack Query for server-side data synchronization
- Local component state with React hooks

**Key Design Decisions**
- Chose Vite over Create React App for superior development experience and build performance
- Selected shadcn/ui for customizable, accessible components without runtime overhead
- Implemented path aliases (@/, @shared/, @assets/) for cleaner imports

### Backend Architecture

**Server Framework**
- Node.js with Express.js for RESTful API implementation
- TypeScript throughout for type safety across frontend and backend
- Modular API route structure under `/server/api` directory

**Authentication & Authorization**
- Dual authentication system:
  - Clerk for modern OAuth-based authentication (admin features)
  - Passport.js with Local Strategy for traditional username/password auth
- Session management using express-session with custom storage
- Role-based access control with user roles (admin/user) and access levels (trial/premium)

**Database Layer**
- PostgreSQL as the primary relational database
- Drizzle ORM for type-safe database operations
- Neon serverless PostgreSQL client with WebSocket support
- Connection pooling for efficient database resource management
- Database schema defined in `/shared/schema.ts` for sharing between client and server

**API Architecture**
- RESTful endpoints organized by resource type:
  - `/api/frameworks` - Compliance framework management
  - `/api/assessments` - Assessment creation and tracking
  - `/api/risks` - Risk management and prediction
  - `/api/policies` - Policy document management
  - `/api/reports` - Compliance report generation
  - `/api/onboarding` - User onboarding workflow
  - `/api/gamification` - Badges and achievement system

**File Management**
- Multer for multipart/form-data handling
- Separate storage directories for logos and documents
- File metadata stored in database with physical files on disk
- Support for document uploads (policies, evidence) and logo management

**AI Integration**
- OpenAI GPT-4o integration for:
  - Risk prediction and analysis
  - Automated remediation plan generation
  - Control gap analysis
  - Policy generation and enhancement
- D-ID virtual agent integration for interactive AI consultant

### Data Storage Solutions

**Database Schema Design**

**Core Entities**
- Users: Authentication and profile information
- Company Info: Organization details and configuration
- Frameworks: Compliance framework definitions (NCA ECC, SAMA, ISO 27001, PDPL)
- Domains: Framework organizational structure
- Subdomains: Granular control groupings
- Controls: Individual compliance requirements

**Assessment System**
- Assessments: Compliance evaluation sessions
- Assessment Results: Control-by-control evaluation results
- Assessment Risks: Risk identification linked to assessments
- Remediation Tasks: Action items for compliance gaps

**Risk Management**
- Risks: General risk register with 47 predefined IT/cybersecurity risks
- Risk categories: Strategic, Operational, Compliance
- Inherent and residual risk levels
- Mitigation tracking with target dates

**Policy Management**
- Policy Categories: Organizational structure for policies
- Policy Templates: Reusable policy frameworks
- Generated Policies: AI-created customized policies
- File attachments for evidence and documentation

**Gamification & Onboarding**
- Onboarding Steps: Structured user journey
- User Progress: Step completion tracking
- Badges: Achievement system
- User Game Stats: Points and progress metrics

**Reporting**
- Compliance Reports: Generated assessment reports
- Report Share Links: Secure sharing with expiration

### Authentication and Authorization Mechanisms

**Clerk Integration**
- OAuth-based authentication for modern user experience
- Public metadata for role assignment (admin/user)
- JWT token handling on client-side
- Custom hooks for Clerk user state management

**Passport.js Strategy**
- Local username/password authentication
- Scrypt-based password hashing with salt
- Session-based authentication with server-side storage
- Timing-safe password comparison to prevent timing attacks

**Authorization Model**
- Role-based access control (RBAC)
- Protected route components for both auth systems
- Separate admin and user dashboards
- API endpoint protection with authentication middleware

**Session Management**
- Express-session with custom storage adapter
- 24-hour session expiration
- Secure cookie configuration for production
- Trust proxy settings for deployment behind reverse proxies

### External Dependencies

**Third-Party Services**

**Authentication**
- Clerk: Modern authentication platform with OAuth support
  - Used for: Admin access, user management, role-based permissions
  - Integration: @clerk/clerk-react SDK

**AI & ML Services**
- OpenAI API: GPT-4o model integration
  - Used for: Risk prediction, policy generation, compliance analysis
  - Features: JSON response format, low temperature for consistency
- D-ID Virtual Agent: Interactive AI avatar
  - Used for: Virtual cybersecurity consultant interface
  - API endpoints for creating talks and streaming responses

**Database**
- Neon Serverless PostgreSQL
  - Connection string via DATABASE_URL environment variable
  - WebSocket support for real-time capabilities
  - Configured with connection pooling (max 10 connections)

**Build & Development Tools**
- Vite: Frontend build tooling and dev server
- Drizzle Kit: Database migration management
- ESBuild: Server-side bundling for production

**UI Component Libraries**
- Radix UI: Headless accessible components (30+ component packages)
- Lucide React: Icon library
- React Hook Form: Form state management with Zod validation
- Recharts: Data visualization (implied by dashboard features)

**File Processing**
- Multer: Multipart form data handling for file uploads
- fs-extra: Enhanced file system operations

**Deployment Considerations**
- Vercel-ready configuration with custom build settings
- Support for Netlify or any Node.js cloud platform
- Static asset serving with fallback routing
- Environment variable configuration for API keys and database connections