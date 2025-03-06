# Competency Manager Implementation Plan

## Overview

The Competency Manager is a core tool in the integrated HR toolkit that allows users to generate, manage, and utilize competency frameworks. This document outlines the implementation plan for the Competency Manager, focusing on the LLM-powered competency generation functionality.

## User Interface Design

### Form Layout

The competency generation form will follow a clean, intuitive layout with:

1. **Mandatory Fields Section** - Clearly marked with asterisks (\*)
2. **Optional Fields Section** - Expandable/collapsible for progressive disclosure
3. **Generation Button** - Prominently displayed at the bottom
4. **Help System** - Tooltips and contextual guidance throughout

### Form Fields

#### Mandatory Fields

1. **Industry/Domain** (Dropdown with "Other" option)

   - Placeholder: "Select the industry or domain"
   - Options:
     - Technology
     - Healthcare
     - Finance
     - Education
     - Manufacturing
     - Retail
     - Government
     - Non-profit
     - Other (enables text input)
   - Tooltip: "Select the industry that best matches your needs. Choose 'Other' to enter a custom industry."

2. **Job Function** (Dropdown with "Other" option)

   - Placeholder: "Select the primary job function"
   - Options:
     - Leadership/Management
     - Technical/Engineering
     - Sales/Marketing
     - Customer Service
     - Administrative
     - Operations
     - Human Resources
     - Finance/Accounting
     - Other (enables text input)
   - Tooltip: "Select the function that best describes the role. Choose 'Other' to enter a custom function."

3. **Role Level** (Dropdown with "Other" option)

   - Placeholder: "Select the role level"
   - Options:
     - Entry Level
     - Junior
     - Mid-Level
     - Senior
     - Lead
     - Manager
     - Director
     - Executive
     - Other (enables text input)
   - Tooltip: "Select the seniority level for the competencies. Choose 'Other' to enter a custom level."

4. **Number of Competencies** (Slider or Number Input)
   - Range: 3-10
   - Default: 5
   - Tooltip: "Select how many competencies you want to generate. 5-7 is recommended for most roles."

#### Optional Fields (Expandable Section)

1. **Competency Type** (Multi-select Dropdown)

   - Placeholder: "Select types of competencies to include"
   - Options:
     - Technical Skills
     - Soft Skills/Behavioral
     - Leadership
     - Core/Organizational
     - Industry-Specific
     - Role-Specific
     - Other (enables text input)
   - Tooltip: "Select the types of competencies you want to include. Leave blank to generate a balanced mix."

2. **Number of Proficiency Levels** (Dropdown)

   - Placeholder: "Select number of proficiency levels"
   - Options: 3, 4, 5
   - Default: 4
   - Tooltip: "Select how many proficiency levels each competency should have. 4 is standard (Basic, Intermediate, Advanced, Expert)."

3. **Specific Requirements** (Text Area)

   - Placeholder: "E.g., 'Focus on cloud architecture skills and team collaboration abilities for a DevOps engineer working in a financial services company'"
   - Tooltip: "Provide any specific details about the role, required skills, or organizational context to make the competencies more relevant."

4. **Organizational Values** (Text Area)

   - Placeholder: "E.g., 'Innovation, Integrity, Customer Focus, Excellence, Teamwork'"
   - Tooltip: "Enter your organization's core values to incorporate them into the competency framework."

5. **Existing Competencies** (Text Area)
   - Placeholder: "E.g., 'Project Management, Stakeholder Communication, Technical Documentation'"
   - Tooltip: "List any existing competencies you want to include or build upon in the new framework."

### User Experience Enhancements

1. **Smart Defaults**

   - Pre-populate fields based on common patterns
   - Remember user's previous selections for repeat usage

2. **Tooltips and Guidance**

   - Contextual help tooltips for each field
   - Information icons with hover/click explanations
   - Example values shown as placeholders

3. **Responsive Validation**

   - Real-time validation of inputs
   - Clear error messages for invalid inputs
   - Suggestions for fixing validation issues

4. **Loading State**
   - Clear indication when competencies are being generated
   - Estimated time to completion
   - Animated loading indicator

## LLM Integration

### LLM Selection

- Primary LLM: Gemini 2.0 Flash
- Fallback LLM: OpenAI GPT-4o (if available) or GPT-3.5 Turbo

### Prompt Engineering

#### Base Prompt Template

```
You are an expert in competency framework development with deep knowledge of skills and behaviors across industries and roles.

Generate a comprehensive competency framework for a {role_level} {job_function} in the {industry} industry.

The framework should include {number_of_competencies} competencies that are:
1. Specific and measurable
2. Relevant to the role and industry
3. Structured with clear progression between levels
4. Actionable for development planning

{additional_context}

For each competency, provide:
- Name: A concise, professional title
- Description: A clear explanation of the competency (2-3 sentences)
- Business Impact: How this competency contributes to organizational success
- {number_of_levels} proficiency levels with:
  - Level Name: (e.g., Basic, Intermediate, Advanced, Expert)
  - Level Description: A brief overview of capabilities at this level
  - Behavioral Indicators: 3-5 specific, observable behaviors that demonstrate this level
  - Development Suggestions: 2-3 activities to develop this competency level

Format the response as structured JSON that can be parsed programmatically.
```

#### Intelligent Gap Filling

When users provide only mandatory fields, the LLM will be instructed to:

1. Generate appropriate competency types based on the industry and role
2. Create balanced competency frameworks with a mix of technical and soft skills
3. Infer likely organizational values based on industry standards
4. Develop appropriate proficiency level descriptions based on role level

#### Additional Context Construction

The system will construct additional context for the LLM based on optional fields:

```
{additional_context} = """
Focus on the following competency types: {competency_types}.
Include {number_of_levels} proficiency levels for each competency.
Specific requirements: {specific_requirements}
Organizational values to incorporate: {organizational_values}
Build upon or complement these existing competencies: {existing_competencies}
"""
```

### Response Processing

1. **JSON Parsing**

   - Parse the LLM response into structured data
   - Validate the structure against expected schema
   - Handle malformed responses with retry logic

2. **Quality Checks**

   - Ensure each competency has the required elements
   - Verify proficiency levels show clear progression
   - Check for duplicate or overly similar competencies

3. **Fallback Mechanisms**
   - Retry with modified prompts if initial generation fails
   - Fall back to template-based generation for specific failures
   - Provide partial results with error indicators if necessary

## Data Model

### Competency Framework

```typescript
interface CompetencyFramework {
  id: string;
  name: string;
  description: string;
  industry: string;
  jobFunction: string;
  roleLevel: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isPublic: boolean;
  competencies: Competency[];
}
```

### Competency

```typescript
interface Competency {
  id: string;
  name: string;
  description: string;
  businessImpact: string;
  type: string;
  frameworkId: string;
  levels: CompetencyLevel[];
}
```

### Competency Level

```typescript
interface CompetencyLevel {
  id: string;
  name: string;
  description: string;
  competencyId: string;
  levelOrder: number;
  behavioralIndicators: string[];
  developmentSuggestions: string[];
}
```

## API Endpoints

### Competency Generation

```
POST /api/competency-manager/generate
```

Request Body:

```json
{
  "industry": "Technology",
  "jobFunction": "Technical/Engineering",
  "roleLevel": "Senior",
  "numberOfCompetencies": 5,
  "competencyTypes": ["Technical Skills", "Soft Skills/Behavioral"],
  "numberOfLevels": 4,
  "specificRequirements": "Focus on cloud architecture...",
  "organizationalValues": "Innovation, Integrity...",
  "existingCompetencies": "Project Management..."
}
```

Response:

```json
{
  "framework": {
    "name": "Senior Technical/Engineering Competency Framework",
    "description": "Competency framework for Senior Technical/Engineering roles in the Technology industry",
    "industry": "Technology",
    "jobFunction": "Technical/Engineering",
    "roleLevel": "Senior",
    "competencies": [
      {
        "name": "Cloud Architecture Design",
        "description": "Ability to design and implement scalable, secure cloud infrastructure solutions.",
        "businessImpact": "Enables organization to leverage cloud technologies for improved scalability, cost efficiency, and innovation.",
        "type": "Technical Skills",
        "levels": [
          {
            "name": "Basic",
            "description": "Understands fundamental cloud concepts and can implement basic cloud solutions with guidance.",
            "levelOrder": 1,
            "behavioralIndicators": [
              "Explains basic cloud service models (IaaS, PaaS, SaaS)",
              "Implements pre-designed cloud solutions following established patterns",
              "Recognizes common cloud security concerns"
            ],
            "developmentSuggestions": [
              "Complete cloud fundamentals certification",
              "Participate in guided cloud migration projects"
            ]
          }
          // Additional levels...
        ]
      }
      // Additional competencies...
    ]
  }
}
```

### Framework Management

```
POST /api/competency-manager/frameworks
GET /api/competency-manager/frameworks
GET /api/competency-manager/frameworks/:id
PUT /api/competency-manager/frameworks/:id
DELETE /api/competency-manager/frameworks/:id
```

### Competency Management

```
POST /api/competency-manager/frameworks/:frameworkId/competencies
GET /api/competency-manager/frameworks/:frameworkId/competencies
GET /api/competency-manager/competencies/:id
PUT /api/competency-manager/competencies/:id
DELETE /api/competency-manager/competencies/:id
```

## Implementation Phases

### Phase 1: Core Generation Functionality

1. Create the database schema for competency frameworks
2. Implement the form UI with mandatory fields
3. Set up the Gemini 2.0 Flash integration
4. Create the basic generation API endpoint
5. Implement response parsing and display

### Phase 2: Enhanced User Experience

1. Add optional fields with progressive disclosure
2. Implement tooltips and guidance system
3. Add validation and error handling
4. Enhance the loading state and feedback

### Phase 3: Framework Management

1. Implement saving and editing of frameworks
2. Add framework listing and filtering
3. Create framework sharing functionality
4. Implement framework export options

### Phase 4: Premium Features

1. Add team collaboration features
2. Implement advanced customization options
3. Create industry-specific templates
4. Add analytics and reporting

## Technical Implementation Details

### Frontend Components

1. **CompetencyGeneratorForm**

   - Handles all form inputs and validation
   - Manages state for mandatory and optional fields
   - Provides tooltips and guidance

2. **CompetencyFrameworkViewer**

   - Displays generated competency framework
   - Allows navigation between competencies
   - Provides editing capabilities

3. **CompetencyLevelDisplay**
   - Visualizes proficiency levels
   - Shows behavioral indicators and development suggestions
   - Provides interactive elements for editing

### Backend Services

1. **CompetencyGenerationService**

   - Constructs prompts for the LLM
   - Handles LLM API calls
   - Processes and validates responses

2. **FrameworkManagementService**

   - Handles CRUD operations for frameworks
   - Manages user permissions and sharing
   - Provides export functionality

3. **CompetencyStandardizationService**
   - Ensures consistency across competencies
   - Deduplicates similar competencies
   - Standardizes terminology and formatting

## Next Steps

1. Set up the database schema in Prisma
2. Create the basic UI components for the form
3. Implement the Gemini 2.0 Flash integration
4. Develop the API endpoints for competency generation
5. Create the competency display components

## Conclusion

This implementation plan provides a comprehensive roadmap for developing the Competency Manager tool. By focusing on LLM-powered competency generation with intelligent gap filling, we can create a powerful tool that provides immediate value to users while laying the foundation for the integrated HR toolkit.

The approach prioritizes user experience with clear guidance, smart defaults, and progressive disclosure of advanced options. The LLM integration with Gemini 2.0 Flash will provide high-quality competency frameworks tailored to specific industries and roles, even when users provide only minimal input.
