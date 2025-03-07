# Competency Reference Data Implementation - 2025-03-06

## Overview

This document outlines the implementation of the competency reference data system. The reference data system provides standardized organizational data structures that support all HR tools, enabling cross-tool integration and data sharing.

## Database Schema

The competency reference data system includes the following models:

### Organizational Reference Data Models

1. **CompetencyCategory**

   - Purpose: Categorizes competencies (e.g., Technical, Leadership, Communication)
   - Fields:
     - id: Unique identifier
     - name: Category name (unique)
     - description: Detailed description
     - createdAt/updatedAt: Timestamps
   - Relationships:
     - One-to-many with Competency

2. **JobLevel**

   - Purpose: Defines progression levels (e.g., Entry, Associate, Senior, Lead, Principal)
   - Fields:
     - id: Unique identifier
     - name: Level name
     - code: Optional code (e.g., "L1", "L2", "L3")
     - description: Detailed description
     - order: For sorting levels in the correct order
     - createdAt/updatedAt: Timestamps
   - Relationships:
     - One-to-many with JobTitle
     - One-to-many with MatrixRole

3. **JobFamily**

   - Purpose: Groups related job functions (e.g., Engineering, Marketing, Sales)
   - Fields:
     - id: Unique identifier
     - name: Family name
     - description: Detailed description
     - createdAt/updatedAt: Timestamps
   - Relationships:
     - One-to-many with JobTitle

4. **JobTitle**

   - Purpose: Combines job family and level with specific title
   - Fields:
     - id: Unique identifier
     - title: Job title
     - description: Detailed description
     - jobFamilyId: Foreign key to JobFamily
     - jobLevelId: Foreign key to JobLevel
     - createdAt/updatedAt: Timestamps
   - Relationships:
     - Many-to-one with JobFamily
     - Many-to-one with JobLevel
     - One-to-many with MatrixRole

5. **Department**

   - Purpose: Organizes job titles within organizational structure
   - Fields:
     - id: Unique identifier
     - name: Department name
     - description: Optional detailed description
     - createdAt/updatedAt: Timestamps

6. **Industry**
   - Purpose: Defines industry contexts for competencies
   - Fields:
     - id: Unique identifier
     - name: Industry name (unique)
     - description: Optional detailed description
     - createdAt/updatedAt: Timestamps
   - Relationships:
     - One-to-many with Competency
     - One-to-many with CompetencyFramework
     - One-to-many with CompetencyMatrix

### Competency Models

1. **CompetencyFramework**

   - Purpose: Groups related competencies for a specific role/industry
   - Fields:
     - id: Unique identifier
     - name: Framework name
     - description: Detailed description
     - industry: Industry name (string, for backward compatibility)
     - industryId: Foreign key to Industry (nullable, for new integration)
     - jobFunction: Job function
     - roleLevel: Role level
     - isPublic: Whether the framework is publicly accessible
     - userId: Foreign key to User
     - createdAt/updatedAt: Timestamps
   - Relationships:
     - Many-to-one with User
     - Many-to-one with Industry (optional)
     - One-to-many with Competency

2. **Competency**

   - Purpose: Defines a specific competency with multiple levels
   - Fields:
     - id: Unique identifier
     - name: Competency name
     - description: Detailed description
     - businessImpact: How this competency impacts business outcomes
     - type: Competency type
     - frameworkId: Foreign key to CompetencyFramework
     - categoryId: Foreign key to CompetencyCategory (nullable)
     - industryId: Foreign key to Industry (nullable)
     - source: Source of the competency (e.g., "JD_EXTRACTED", "USER_CREATED")
     - sourceJdId: ID of the source job description (if extracted)
     - createdAt/updatedAt: Timestamps
   - Relationships:
     - Many-to-one with CompetencyFramework
     - Many-to-one with CompetencyCategory (optional)
     - Many-to-one with Industry (optional)
     - One-to-many with CompetencyLevel
     - Many-to-many with JobDescription
     - One-to-many with RoleCompetencyLevel

3. **CompetencyLevel**
   - Purpose: Defines a specific level of proficiency for a competency
   - Fields:
     - id: Unique identifier
     - name: Level name
     - description: Detailed description
     - levelOrder: Order of the level (for sorting)
     - behavioralIndicators: Array of observable behaviors
     - developmentSuggestions: Array of development activities
     - competencyId: Foreign key to Competency
     - createdAt/updatedAt: Timestamps
   - Relationships:
     - Many-to-one with Competency

### Competency Matrix Models

1. **CompetencyMatrix**

   - Purpose: Maps competencies to roles with required levels
   - Fields:
     - id: Unique identifier
     - name: Matrix name
     - description: Detailed description
     - industryId: Foreign key to Industry (nullable)
     - userId: Foreign key to User
     - isPublic: Whether the matrix is publicly accessible
     - createdAt/updatedAt: Timestamps
   - Relationships:
     - Many-to-one with User
     - Many-to-one with Industry (optional)
     - One-to-many with MatrixRole

2. **MatrixRole**

   - Purpose: Defines a role within a competency matrix
   - Fields:
     - id: Unique identifier
     - title: Role title
     - description: Detailed description
     - matrixId: Foreign key to CompetencyMatrix
     - jobTitleId: Foreign key to JobTitle (nullable)
     - jobLevelId: Foreign key to JobLevel (nullable)
   - Relationships:
     - Many-to-one with CompetencyMatrix
     - Many-to-one with JobTitle (optional)
     - Many-to-one with JobLevel (optional)
     - One-to-many with RoleCompetencyLevel

3. **RoleCompetencyLevel**
   - Purpose: Maps a competency to a role with a required level
   - Fields:
     - id: Unique identifier
     - roleId: Foreign key to MatrixRole
     - competencyId: Foreign key to Competency
     - levelRequired: Level name (references CompetencyLevel.name)
   - Relationships:
     - Many-to-one with MatrixRole
     - Many-to-one with Competency

## API Implementation

The reference data API implementation follows these key patterns:

### CRUD Operations

1. **GET**: List all items with optional filtering

   - Example: `GET /api/reference/competency-categories`
   - Returns: Array of competency categories

2. **POST**: Create new item (admin only)

   - Example: `POST /api/reference/competency-categories`
   - Payload: `{ name: "Technical", description: "Technical competencies related to job-specific skills" }`
   - Returns: Created competency category

3. **PUT**: Update existing item (admin only)

   - Example: `PUT /api/reference/competency-categories`
   - Payload: `{ id: "123", name: "Technical Skills", description: "Updated description" }`
   - Returns: Updated competency category

4. **DELETE**: Remove item if not in use (admin only)
   - Example: `DELETE /api/reference/competency-categories?id=123`
   - Returns: Success message

### Authentication and Authorization

- All endpoints require authentication
- Write operations (POST, PUT, DELETE) require admin role
- Read operations (GET) available to all authenticated users

### Validation Patterns

- Check for required fields
- Validate uniqueness constraints
- Prevent deletion of items in use
- Return appropriate status codes and error messages

### Response Structure

- Success responses include the affected item(s)
- Error responses include a descriptive message
- Appropriate HTTP status codes for different scenarios

## Implementation Patterns

### Admin-Only Reference Data Management

- Reference data creation/modification requires admin role
- API endpoints validate user.role === "admin" before allowing changes
- Regular users can only read reference data
- This ensures consistency and quality of reference data

### Backward Compatibility Approach

- All new relationships use nullable foreign keys
- Existing fields (e.g., industry as string) maintained alongside new relations
- API versioning strategy for enhanced endpoints
- Progressive enhancement for UI components

### Premium vs. Freemium Features

- Freemium: Access to standalone tools with basic functionality
- Premium: Cross-tool integration and data sharing
- Premium: Saving and reusing competencies across tools
- Premium: Advanced features like competency matrices

### JD-First Approach

- Competencies can be extracted from job descriptions
- LLM standardizes extracted competencies
- Premium users can save extracted competencies
- This creates a natural workflow from JD creation to competency management

## Next Steps

1. Implement remaining reference data API endpoints:

   - Job levels
   - Job families
   - Job titles
   - Industries

2. Create seed data for common reference data:

   - Standard competency categories
   - Common job levels
   - Industry-standard job families
   - Sample job titles

3. Develop admin interfaces for managing reference data:

   - CompetencyCategoryManager
   - JobLevelManager
   - JobFamilyManager
   - JobTitleManager
   - IndustryManager

4. Implement competency extraction and standardization in JD Developer:
   - Create LLM service to extract competencies from JD content
   - Develop standardization logic to ensure consistency
   - Implement deduplication to prevent similar competencies
   - Add "Save Competencies" feature for premium users
