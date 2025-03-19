# Modular Architecture Plan for Synthalyst

## Overview

This document outlines a strategy for restructuring the Synthalyst application into a collection of standalone apps that integrate into an overall platform. This approach will resolve the current deployment issues and create a more maintainable and scalable architecture for the future.

## Current Challenges

1. **Deployment Issues**: The current unified application experiences component resolution issues during Vercel deployment.
2. **Dependency Conflicts**: Tailwind CSS v4 and other dependencies create build-time conflicts.
3. **Module Resolution Problems**: Path aliases and import resolution fail in production builds.
4. **Complex Build Process**: Current build process requires extensive workarounds and fixes.
5. **Limited Scalability**: Monolithic approach creates limitations for future growth.
6. **CSS Processing Issues**: Tailwind CSS integration and loading order problems affect both local and production environments.
7. **UI Component Resolution**: Critical UI components fail to resolve correctly in production builds.

## Benefits of Modular Architecture

1. **Isolated Builds**: Each module builds independently, reducing dependency conflicts.
2. **Focused Development**: Teams can focus on specific areas without impacting others.
3. **Progressive Updates**: Modules can be updated incrementally without full rebuild.
4. **Technology Flexibility**: Different modules can use different technology stacks as needed.
5. **Performance Optimization**: Smaller, focused bundles improve load times and performance.
6. **Improved Maintainability**: Clear separation of concerns and boundaries between features.
7. **Independent Scaling**: High-traffic modules can be scaled independently.
8. **Resilient Deployments**: Issues in one module won't prevent other modules from deploying successfully.
9. **Simplified Dependency Management**: Each module can manage its own dependencies and versions.

## Implementation Approach

We will adopt a hybrid approach, combining Next.js route groups with the concept of a monorepo structure while maintaining a single repository for now. This approach provides modular benefits without significantly changing the repository structure.

### Phase 1: Restructure with Next.js Route Groups (1-2 weeks)

1. **Create Route Groups**:

   - `(admin)` - Administrative dashboard and tools
   - `(public)` - Main public-facing website
   - `(knowledge)` - Knowledge GPT and related tools
   - `(applications)` - Application tools like ApplyRight
   - `(blog)` - Blog platform
   - `(auth)` - Authentication systems

2. **Reorganize Components Structure**:

   ```
   nextjs-app/
   ├── src/
   │   ├── app/
   │   │   ├── (admin)/
   │   │   │   ├── components/  # Admin-specific components
   │   │   │   ├── lib/         # Admin-specific utilities
   │   │   │   ├── styles/      # Admin-specific styles
   │   │   │   └── [...routes]  # Admin routes
   │   │   ├── (public)/
   │   │   │   ├── components/  # Public-specific components
   │   │   │   └── [...routes]  # Public routes
   │   │   └── [...other route groups]
   │   ├── components/          # Truly shared components
   │   ├── lib/                 # Shared utilities
   │   └── styles/              # Shared styles
   ```

3. **Modify Build Process**:
   - Update scripts to support building independent route groups
   - Create a staged build process that builds each group separately
   - Create fallback mechanisms for route group failures

### Phase 2: Shared Components System (2-3 weeks)

1. **Create a UI Component Library**:

   - Establish a `/shared/ui` directory for common components
   - Build a simple component documentation system
   - Define strict interfaces for all shared components

2. **Implement Component Versioning**:

   - Add versioning to shared components
   - Allow modules to specify which version of components they use
   - Create a compatibility layer for backward compatibility

3. **Develop Module Boundary Rules**:
   - Define explicit rules for inter-module communication
   - Establish patterns for cross-module data access
   - Create standardized API interfaces between modules

### Phase 3: Deployment Infrastructure (1-2 weeks)

1. **Create Module-Specific Vercel Configurations**:

   - Generate separate `vercel.json` for each module
   - Define specific build commands for each module
   - Implement module-specific environment variables

2. **Setup Staged Deployments**:

   - Configure module-specific preview environments
   - Create a master deployment that aggregates modules
   - Implement health checks to prevent integration of broken modules

3. **CI/CD Pipeline Enhancements**:
   - Set up GitHub Actions workflows for per-module testing
   - Create automated preview deployments for each module
   - Implement composite status checks for interdependent modules

### Phase 4: Advanced Modularization (Future Roadmap)

1. **True Monorepo Structure**:

   - Migrate to Turborepo/Nx for sophisticated monorepo management
   - Implement workspace-based dependency management
   - Create shared package infrastructure

2. **Micro-Frontend Architecture**:

   - Implement Module Federation for runtime component sharing
   - Create a shell application for module integration
   - Develop runtime module loading strategies

3. **Independent Versioning and Releases**:
   - Implement semantic versioning for all modules
   - Create a release calendar for different modules
   - Develop a centralized version management system

## CSS Strategy

Given the persistent issues with CSS processing and Tailwind integration, we need a dedicated strategy for CSS modularization:

### CSS Architecture (2 weeks)

1. **Module-Specific CSS Structure**:

   - Each module maintains its own CSS/Tailwind configuration
   - Clear separation between global styles and module-specific styles
   - Explicit ordering of CSS imports to prevent cascade conflicts

2. **Design Token Standardization**:

   - Create a shared design token system (colors, spacing, typography)
   - Implement as CSS custom properties in a core styles package
   - Each module imports and extends the core tokens

3. **CSS Loading Strategy**:

   - Implement proper CSS isolation between modules
   - Use CSS Modules or Tailwind's prefix feature for scoping
   - Eliminate path aliases for CSS imports, using relative paths
   - Create strict import order convention with documentation

4. **Tailwind Implementation**:

   - Consider downgrading to Tailwind CSS v3 for stability
   - Create a standardized PostCSS configuration for all modules
   - Implement module-specific Tailwind configurations with explicit content paths
   - Use scope prefixes to prevent class name collisions

5. **CSS Build Optimization**:

   - Implement critical CSS extraction per module
   - Create optimized production CSS builds with purging
   - Set up monitoring for CSS bundle sizes
   - Establish a CSS performance budget per module

6. **UI Component CSS Integration**:

   - Create explicit styling patterns for UI components
   - Decide between CSS-in-JS, CSS Modules, or utility classes
   - Document component styling conventions
   - Implement CSS encapsulation to prevent style leakage

## Data Sharing Strategy

To ensure efficient data exchange between modules while maintaining clear boundaries:

### Data Architecture (2-3 weeks)

1. **Shared Data Models**:

   - Create a `/shared/models` directory for data types used across modules
   - Implement strict type checking for shared data
   - Develop versioning strategy for data models

2. **State Management Approach**:

   - Determine appropriate state management for cross-module communication
   - Implement module-specific state stores with defined interfaces
   - Create patterns for passing state between modules (URL parameters, localStorage)
   - Define standard for persistent vs. ephemeral state

3. **Data Fetching Strategy**:

   - Create a standardized data access layer
   - Implement caching strategies to minimize redundant fetches
   - Define policies for data freshness and invalidation
   - Document data ownership by module

4. **Database Access Patterns**:

   - Create clear data access boundaries for each module
   - Implement module-specific database migrations
   - Define cross-module data access protocols
   - Establish data integrity rules across module boundaries

5. **Authentication and Authorization**:

   - Create a central authentication service
   - Implement modular authorization with role-based permissions
   - Define session management approach across modules
   - Document security boundaries between modules

## API Contract Documentation

To ensure reliable communication between modules:

### API Standards (2 weeks)

1. **Internal API Contracts**:

   - Create a formal specification for inter-module APIs
   - Document all module boundaries and interfaces
   - Implement strict type checking for API payloads
   - Establish standards for error handling and responses

2. **API Versioning Strategy**:

   - Define semantic versioning for internal APIs
   - Create deprecation policies and timelines
   - Implement backward compatibility layers
   - Document breaking vs. non-breaking changes

3. **API Documentation System**:

   - Implement automated API documentation generation
   - Create a central repository for API contracts
   - Define standards for API documentation format
   - Set up API contract validation in CI/CD

4. **Error Handling Standards**:

   - Create consistent error formats across all modules
   - Define standard error codes and messages
   - Implement error tracking and logging
   - Document recovery strategies for common errors

5. **Performance Requirements**:

   - Define performance SLAs for internal APIs
   - Implement performance monitoring
   - Establish caching policies for APIs
   - Document rate limiting and throttling approaches

## Local Development Workflow

To ensure efficient development within a modular architecture:

### Development Environment (1-2 weeks)

1. **Module Development Workflow**:

   - Create scripts for running individual modules
   - Implement mock services for module dependencies
   - Define strategies for working on multiple modules
   - Document module development processes

2. **Hot-Reloading Strategy**:

   - Implement efficient hot-reloading for module development
   - Create a development proxy for cross-module connections
   - Optimize rebuild times for modules
   - Document known limitations and workarounds

3. **Testing Strategy**:

   - Define approaches for isolated vs. integrated testing
   - Create testing utilities for module boundaries
   - Implement mock data generation for testing
   - Document test coverage requirements per module

4. **Development Tools**:

   - Set up VSCode workspace configurations for modules
   - Create standardized linting and formatting rules
   - Implement pre-commit hooks for quality checks
   - Document required development tooling

5. **Environment Variables Management**:

   - Create module-specific .env files
   - Implement environment variable validation
   - Document required variables per module
   - Establish secrets management approach

## Risk Management

To proactively address potential challenges during migration:

### Risk Assessment and Mitigation (1 week)

1. **Identified Risks**:

   - Module integration failures
   - Performance degradation during transition
   - User experience inconsistencies
   - Data consistency issues across modules
   - Deployment pipeline complexity
   - Development workflow disruption
   - Increased initial build times

2. **Mitigation Strategies**:

   - Implement feature flags for progressive rollout
   - Create comprehensive smoke test suite for critical paths
   - Establish performance benchmarks before migration
   - Develop automated integration testing between modules
   - Create detailed documentation for development workflows
   - Implement monitoring for all critical metrics

3. **Contingency Plans**:

   - Define criteria for halting migration if issues arise
   - Create fallback mechanisms to previous architecture
   - Establish emergency response procedures for production issues
   - Develop strategies for rapid issue identification and resolution
   - Document paths to rollback modules independently

4. **Rollback Procedures**:

   - Create snapshot capability before major migrations
   - Implement database migration reversibility
   - Establish processes for reverting individual modules
   - Document dependencies between module migrations
   - Define criteria for rollback decisions

## User Experience Continuity

To maintain consistent user experience during migration:

### User Experience Strategy (1-2 weeks)

1. **Consistent UX Guidelines**:

   - Create a shared design system across modules
   - Implement standardized UX patterns and interactions
   - Document module-specific UX requirements
   - Establish guidelines for maintaining visual consistency

2. **Session Continuity**:

   - Define approach for maintaining user sessions across modules
   - Implement seamless authentication handoffs
   - Create strategies for preserving user context and state
   - Document user flow transitions between modules

3. **URL Structure and Routing**:

   - Define URL structure for modular architecture
   - Implement redirection strategy for legacy URLs
   - Create routing approach between modules
   - Document routing conventions and patterns

4. **Transition Strategy**:

   - Implement progressive feature rollout to limit disruption
   - Create user communication plan for changes
   - Develop strategies for gathering user feedback during transition
   - Define approach for communicating module-specific updates

5. **Performance Perception**:

   - Focus on perceived performance during transitions
   - Implement skeleton screens and loading indicators
   - Create consistent loading states across modules
   - Document performance requirements for user interactions

## Performance Metrics

To ensure the modular architecture meets performance requirements:

### Performance Monitoring (1-2 weeks)

1. **Performance Benchmarks**:

   - Establish baseline metrics for current application
   - Define target metrics for each module
   - Create performance budgets for critical user flows
   - Document acceptable performance thresholds

2. **Monitoring Infrastructure**:

   - Implement per-module performance monitoring
   - Create dashboards for critical metrics
   - Establish alerting for performance degradation
   - Document monitoring approach and tools

3. **Cross-Module Performance**:

   - Define metrics for module interaction performance
   - Implement monitoring for cross-module operations
   - Establish baselines for data sharing efficiency
   - Document optimization strategies for module boundaries

4. **User-Centric Metrics**:

   - Focus on Core Web Vitals for each module
   - Implement real user monitoring (RUM)
   - Create user-centric performance dashboards
   - Document user experience impact of performance issues

5. **Continuous Optimization Process**:

   - Establish regular performance review cycles
   - Create performance improvement targets
   - Implement automated performance regression testing
   - Document performance optimization techniques

## Detailed Module Breakdown

### Admin Module

**Purpose**: Management interface for site administrators
**Components**:

- User management
- Content moderation
- System settings
- Email logs
- Analytics dashboard

**Independence Level**: High (can function completely independently)
**Shared Dependencies**: Authentication, data models
**Deployment Strategy**: Isolated build and deployment with admin-specific configuration
**CSS Strategy**: Scoped CSS with minimal external dependencies
**Critical Interfaces**: User data, system configuration, content access

### Public Module

**Purpose**: Main website for anonymous and authenticated users
**Components**:

- Homepage
- About pages
- Pricing
- Contact form
- Feature showcase

**Independence Level**: Medium (shares styling and branding elements)
**Shared Dependencies**: UI components, authentication
**Deployment Strategy**: Primary deployment target with fallback content
**CSS Strategy**: Core branding CSS with global style tokens
**Critical Interfaces**: Authentication, feature availability, user context

### Knowledge GPT Module

**Purpose**: AI-powered knowledge tools
**Components**:

- Chat interface
- Knowledge database
- Domain selection
- Medical knowledge integration
- Web search features

**Independence Level**: Medium-High (specialized functionality)
**Shared Dependencies**: Authentication, UI components
**Deployment Strategy**: Specialized build with AI service connections
**CSS Strategy**: Focused UI component styling with minimal external dependencies
**Critical Interfaces**: User context, authentication, shared UI components

### Applications Module

**Purpose**: Productivity tools for users
**Components**:

- ApplyRight
- Interview Prep
- Document tools
- Task management

**Independence Level**: Medium (shares UI patterns)
**Shared Dependencies**: Document processing, authentication
**Deployment Strategy**: Feature-flag enabled deployments for incremental updates
**CSS Strategy**: Application-specific styling with shared UI component themes
**Critical Interfaces**: User data, document storage, authentication

### Blog Module

**Purpose**: Content publishing platform
**Components**:

- Blog listing
- Article pages
- Author profiles
- Content creation tools
- Comment system

**Independence Level**: Medium-High (content-focused)
**Shared Dependencies**: UI components, authentication
**Deployment Strategy**: Content-focused deployment with CDN integration
**CSS Strategy**: Content-specific styling with typography system
**Critical Interfaces**: User profiles, content storage, authentication

## Migration Strategy

1. **Start with Problematic Modules First**:

   - Begin with admin module (currently causing build issues)
   - Create isolated build for admin functionality
   - Verify deployment works correctly
   - Progressively migrate other modules

2. **Implement Shared Components Early**:

   - Identify and migrate truly shared components first
   - Create versioned interfaces for critical UI elements
   - Develop strict module boundaries with clear interfaces

3. **Gradual Route Group Migration**:

   - Migrate routes to appropriate groups incrementally
   - Update imports to use local components where possible
   - Test each migration thoroughly before proceeding

4. **Build Process Updates**:
   - Update build scripts to support modular building
   - Create fallback mechanisms for module failures
   - Implement proper error reporting for each module

## External App Integration

To incorporate existing standalone applications (e.g., Turnover Calculator, Apartment Affordability Calculator) into the modular architecture, we'll follow this systematic approach:

### Integration Process (2-3 weeks per app)

1. **App Analysis and Preparation**:

   - Audit the standalone app's codebase structure and dependencies
   - Identify integration requirements and potential conflicts
   - Create an integration checklist for each app
   - Document the app's current state, functionality, and user flows

2. **Physical Code Migration**:

   - Create a dedicated route group in `src/app/` (e.g., `(turnover)`, `(affordability)`)
   - Copy core application code from the standalone repository
   - Migrate components to the module's component directory (`src/app/(app-name)/components/`)
   - Move utility functions to the module's lib directory (`src/app/(app-name)/lib/`)
   - Create a module-specific styles directory (`src/app/(app-name)/styles/`)

3. **Structure Adaptation**:

   - Convert to Next.js App Router format if not already using it:
     - Rename `index.js/tsx` files to `page.js/tsx`
     - Structure routes as directories with `page.js/tsx` files inside
     - Create appropriate `layout.tsx` files for module-specific layouts
   - Adapt routing patterns to match the main application conventions
   - Create module-specific entry points and navigation components

4. **Code Refactoring**:

   - Update import paths to reflect the new structure
   - Replace absolute imports with relative imports within the module
   - Update any hard-coded URLs or paths to use dynamic configurations
   - Adapt API calls to match the main application patterns
   - Refactor any incompatible code patterns or approaches

5. **Dependency Management**:

   - Add unique dependencies to the main project's package.json
   - Remove duplicate dependencies already present in the main project
   - Resolve version conflicts with shared dependencies
   - Update package imports to use the main project's dependencies where appropriate
   - Document any critical version requirements

### Integration Patterns

1. **CSS Integration**:

   - Create module-specific stylesheets that follow the project's CSS architecture
   - Use module-specific CSS variables that extend the core design tokens
   - Implement scoped CSS using the module's prefix or CSS Modules
   - Import module-specific styles in the module's layout component
   - Update any inline styles or styled-components to match the project's approach

2. **Authentication Integration**:

   - Connect the integrated app to the main project's authentication system
   - Update protected routes to use the shared auth patterns
   - Implement role-based access control if required
   - Ensure session persistence across module boundaries
   - Test authentication flows thoroughly after integration

3. **Data Integration**:

   - Adapt data models to work with the main project's database schema
   - Create appropriate migrations for any new tables or fields
   - Update API routes to use the shared database connections
   - Implement data sharing patterns for cross-module functionality
   - Create data access boundaries and permissions

4. **Configuration Management**:

   - Consolidate environment variables with the main project's configuration
   - Create module-specific configuration files where needed
   - Update hardcoded configuration values to use environment variables
   - Document all configuration requirements
   - Test with different environment configurations

### Testing Strategy

1. **Standalone Testing**:

   - Create a testing plan for the integrated module
   - Implement unit tests for critical module functionality
   - Develop integration tests for module boundaries
   - Create visual regression tests to verify UI consistency
   - Document test coverage and critical test cases

2. **Cross-Module Testing**:

   - Test interactions between the integrated module and other modules
   - Verify navigation flows between modules
   - Test data sharing between modules
   - Validate authentication and session persistence
   - Check for styling conflicts or inconsistencies

### Example Integration: Turnover Calculator

```
// Before: Standalone Project Structure
turnover-app/
├── public/
├── src/
│   ├── components/
│   │   ├── Calculator.tsx
│   │   ├── DataEntry.tsx
│   │   └── Results.tsx
│   ├── utils/
│   │   ├── calculations.ts
│   │   └── formatters.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── styles.css
├── package.json
└── tsconfig.json

// After: Integrated Module Structure
nextjs-app/
├── src/
│   ├── app/
│   │   ├── (turnover)/
│   │   │   ├── components/
│   │   │   │   ├── Calculator.tsx
│   │   │   │   ├── DataEntry.tsx
│   │   │   │   └── Results.tsx
│   │   │   ├── lib/
│   │   │   │   ├── calculations.ts
│   │   │   │   └── formatters.ts
│   │   │   ├── styles/
│   │   │   │   └── turnover.css
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
```

### Import Adaptation Example

```typescript
// Before (in standalone app)
import { Calculator } from "./components/Calculator";
import { formatCurrency } from "./utils/formatters";

// After (in integrated module)
import { Calculator } from "../components/Calculator";
import { formatCurrency } from "../lib/formatters";

// When using shared components
import { Button } from "@/components/shared/ui/button";
```

### Integration Checklist

For each app integration:

1. **Pre-Integration**:

   - [ ] Document current functionality and user flows
   - [ ] Inventory all dependencies and versions
   - [ ] Identify shared components that can be reused
   - [ ] Create integration timeline and milestones

2. **During Integration**:

   - [ ] Create module route group structure
   - [ ] Migrate core code to new structure
   - [ ] Update import paths and dependencies
   - [ ] Adapt API routes and data access
   - [ ] Implement module-specific styles
   - [ ] Connect to authentication system

3. **Post-Integration**:
   - [ ] Test all functionality
   - [ ] Verify responsive design
   - [ ] Check accessibility compliance
   - [ ] Validate performance metrics
   - [ ] Document any limitations or issues
   - [ ] Update user documentation

## Action Items

1. **Immediate Tasks (Week 1)**:

   - Create route group structure in Next.js app
   - Move admin components to dedicated admin module folder
   - Update imports to use local paths
   - Create module-specific build configuration
   - Establish baseline performance metrics
   - Define initial risk assessment

2. **Short-term Tasks (Week 2-3)**:

   - Establish shared component library
   - Migrate remaining routes to appropriate groups
   - Update Vercel configuration for modular builds
   - Create CI/CD workflows for modular testing
   - Implement CSS strategy for first modules
   - Develop initial API contracts

3. **Medium-term Tasks (Month 1-2)**:

   - Implement versioning for shared components
   - Create comprehensive documentation for module boundaries
   - Develop incremental deployment strategy
   - Set up automated testing for module interdependencies
   - Establish performance monitoring infrastructure
   - Complete CSS migration for all modules

4. **Long-term Vision (3+ Months)**:
   - Evaluate transition to true monorepo structure
   - Consider micro-frontend architecture for key components
   - Implement advanced module federation techniques
   - Develop sophisticated module dependency management
   - Optimize cross-module performance
   - Refine developer experience for modular workflow

## Team Structure and Responsibilities

To support the modular architecture, we recommend organizing teams around modules:

### Team Organization (1 week)

1. **Core Platform Team**:

   - Responsible for shared components and infrastructure
   - Maintains deployment pipelines and build process
   - Defines and enforces standards across modules
   - Manages cross-cutting concerns (auth, monitoring)

2. **Module Teams**:

   - Admin Module Team
   - Public Website Team
   - Applications Team
   - Knowledge GPT Team
   - Blog Team

3. **Module Team Responsibilities**:

   - End-to-end ownership of module functionality
   - Module-specific testing and quality assurance
   - Module performance optimization
   - Module-specific feature development

4. **Cross-functional Roles**:
   - UX/UI designers working across modules for consistency
   - DevOps engineers supporting all teams
   - Security specialists reviewing module boundaries
   - Performance engineers optimizing cross-module interactions

## Conclusion

This modular architecture approach will resolve the current deployment issues while simultaneously creating a more maintainable, scalable, and future-proof application architecture. By breaking down the application into logical, independent modules, we can ensure faster development cycles, easier maintenance, and better overall performance for the Synthalyst platform.

The migration will be gradual and incremental, starting with the most problematic areas (admin functionality) and progressively extending to other parts of the application. This ensures minimal disruption while steadily improving the architecture.

With comprehensive strategies for CSS management, data sharing, API contracts, risk management, and performance monitoring, this plan addresses both immediate challenges and long-term architectural goals. The result will be a resilient, modular platform that can evolve more rapidly to meet changing requirements.

## Appendix: Example Module Configuration

### Example Admin Module Structure

```
nextjs-app/
├── src/
│   ├── app/
│   │   ├── (admin)/
│   │   │   ├── components/
│   │   │   │   ├── AdminLayout.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── UserTable.tsx
│   │   │   │   └── email-logs/
│   │   │   │       ├── EmailLogList.tsx
│   │   │   │       └── EmailLogFilter.tsx
│   │   │   ├── lib/
│   │   │   │   ├── admin-api.ts
│   │   │   │   └── permissions.ts
│   │   │   ├── styles/
│   │   │   │   ├── admin.css
│   │   │   │   └── components/
│   │   │   │       ├── sidebar.css
│   │   │   │       └── tables.css
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── users/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── email-logs/
│   │   │   │   └── page.tsx
│   │   │   └── feedback/
│   │   │       └── page.tsx
```

### Example Admin Vercel Configuration

```json
{
  "buildCommand": "cd nextjs-app && npm install && node scripts/build-admin.js",
  "installCommand": "cd nextjs-app && npm install",
  "framework": "nextjs",
  "outputDirectory": "nextjs-app/.next",
  "env": {
    "MODULE": "admin",
    "NEXT_PUBLIC_MODULE": "admin"
  }
}
```

### Example Build Script (build-admin.js)

```javascript
/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Clean cache and build artifacts for admin module
console.log("Building admin module...");
execSync("rm -rf node_modules/.cache .next/cache/admin", { stdio: "inherit" });

// Install module-specific dependencies
console.log("Installing admin module dependencies...");
execSync("npm install --save @headlessui/react @radix-ui/react-dropdown-menu", {
  stdio: "inherit",
});

// Generate Prisma client
console.log("Generating Prisma client...");
execSync("npx prisma generate", { stdio: "inherit" });

// Build Next.js app with admin module focus
console.log("Building Next.js admin module...");
execSync("npx next build", { stdio: "inherit" });

console.log("Admin module build completed successfully");
```

### Example Tailwind Configuration for Admin Module

```javascript
// tailwind.admin.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Use prefix to avoid collisions with other modules
  prefix: "adm-",
  content: [
    "./src/app/(admin)/**/*.{js,ts,jsx,tsx}",
    "./src/components/shared/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Extend with admin-specific theme values
      colors: {
        // Import from shared design tokens
        ...require("./src/styles/tokens/colors.js"),
        // Admin-specific overrides
        "admin-primary": "hsl(var(--admin-primary))",
        "admin-secondary": "hsl(var(--admin-secondary))",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
```

### Example Module API Contract

```typescript
// src/shared/api-contracts/admin.ts

/**
 * Admin Module API Contract - v1.0.0
 *
 * This contract defines the interfaces for communication with the Admin module.
 * Any changes to these interfaces must follow semantic versioning principles.
 */

export interface AdminUserOperations {
  /**
   * Get a list of users with optional filtering
   * @version 1.0.0
   */
  getUsers(params: {
    page?: number;
    limit?: number;
    role?: string;
    status?: "active" | "inactive" | "pending";
  }): Promise<{
    users: UserSummary[];
    total: number;
    pages: number;
  }>;

  /**
   * Get detailed information about a specific user
   * @version 1.0.0
   */
  getUserDetails(userId: string): Promise<UserDetails>;

  /**
   * Update a user's information
   * @version 1.0.0
   */
  updateUser(
    userId: string,
    data: Partial<UserUpdateData>
  ): Promise<{
    success: boolean;
    user?: UserDetails;
    error?: string;
  }>;
}

// Type definitions for the contract
export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
}

export interface UserDetails extends UserSummary {
  lastLogin: string | null;
  permissions: string[];
  subscription?: {
    plan: string;
    status: string;
    expiresAt: string | null;
  };
  profile: {
    avatar?: string;
    bio?: string;
    company?: string;
    jobTitle?: string;
  };
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  role?: string;
  status?: "active" | "inactive" | "pending";
  permissions?: string[];
  profile?: Partial<UserDetails["profile"]>;
}
```
