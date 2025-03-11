# Project Brief - Synthalyst Web App

This app is a Comprehensive Business and Productivity Platform designed to offer a blend of content, digital tools, and AI-powered services to individuals and businesses. It serves as a hub for professional development, productivity enhancement, and business solutions.

It is a mobile first web app that is built with Next.js, Tailwind CSS, and Shadcn UI.

Though it currently contains HR focused tools, it is NOT a HR focused app. It is a general purpose app that can be used by anyone in any industry.

It is therefore important to design the app with a focus on usability and user experience, and grouping tools by functionality and purpose.

## Purpose & Value Proposition

This app aims to be a one-stop platform for professionals and businesses seeking:

- Expert content and on-demand AI consulting services.
- Custom document and task management solutions.
- AI-powered productivity tools.
- End-to-end digital support from job description drafting to upskilling and productivity optimization.

The platform's fusion of content, commerce, AI-powered tools, and advisory services distinguishes it as a next-generation professional ecosystem.

## Core Pages and Features

### Home Page

- Highlights APP contents with navigational links to all core pages.
- Displays live counts (e.g., downloads, clients, visitors, etc.) and client testimonials.
- Provides social media links for external engagement.

### Blog Page - The Synth Blog

- Supports blog postings with a comments section for user interaction.
- Includes links to related articles, referenced content, and other relevant APP pages.
- blogs should be globally accessible to all users whether or not they are logged in.
- only authenticated users should be able to create new blogs.
- all blog posts on The Synth Blog should follow this guide: [content_creation_guide.md](guides/content_creation-guide.md)
- users should be able to choose to generate blog posts using llm.
- LLM should be properly prompted to follow the guide when creating blog posts for users
- authenticated users should be made aware of the content creation guide for The Synth Blog
- blog creation should be guided by an llm to ensure consistency and quality.
- when users create a new blog post without the use of an LLM, LLM should provide feedback to the user on the blog post creation page on adherence to the guide.
- feedback should be in form of a score on adherence to the guide, and tips to the user on how to improve the blog post to achieve a higher score.
- scores on adherence to the guide for each published blog post should be displayed on the admin dashboard.
- admins should be able to delete blog posts that do not follow the guide and provide feedback to the user who created the blog post.
- blogs should be able to be edited and deleted by the user who created them.
- blogs should be able to be shared on social media.
- blog posts should be able to be tagged with keywords.
- blog creation page requires the integration of a rich text editor with capability to add images, videos, and embeds from X, Youtube, etc.
- blog posts should be able to be categorized into one or more categories.
- llm should be able to generate blog posts in different languages.
- blog post creators should be aware of the languages the LLM can write in.
- readers should be able to choose their preferred language for reading blog posts.
- language choices should determine the language of the blog post content on each users's view of posted blogs.

### Blog App - Cozy Corner

- Cozy Corner is a blog app that is dedicated to providing a platform for users to conveniently create blogs with the help of an LLM.
- This app is a separate app from The Synth Blog.
- It will be a paid service with a subscription model.
- The app will be integrated into the main app as a page.

#### AI-Powered Content Generation

##### Agent Provider

- Web content research using Google Custom Search API
- Multiple source content generation
- Content embedding and similarity search
- Vectorization for relevance ranking
- Reference material processing
- Content indexing

##### Agent Creator

- Blog content generation
- Context-aware content creation
- Semantic search integration
- Reference material prioritization
- Fact-checking with Gemini

#### Content Generation Workflows

##### User-Led Process

1. User initiates with title
2. Real-time research and suggestions
3. Auto-completion as user types
4. Dynamic content updates
5. User control over suggestions
6. Final verification

##### AI-Led Process

1. Title suggestion generation
2. Content research and generation
3. User-guided revisions
4. Dynamic content updates
5. Final verification

#### System Instructions

- Local storage with backend sync
- Categorization:
  - Content style
  - Tone
  - Research depth
  - Writing style
- Template system
- Real-time switching
- Version control
- Dual agent application

#### Scratchpad Integration

- Toggle-able interface
- AI assistance integration
- Real-time content sync
- Automatic mode switching
- Main editor synchronization

#### Detailed AI Implementation

We will have two llm agents for the app: one for content fetching and one for blog creation.
the llm agents: provider and creator.

##### Agent Provider Story

- agent can fetch content from the internet using Google Custom Search API
- agent can generate multiple related content from various sources
- app will create and manage content embeddings for similarity search
- app will use vectorization for content relevance ranking
- agent can process user-uploaded reference materials (PDFs, docs, text files)
- agent can extract content from user materials
- agent can perform fact-checking on agent creator's blog output.

##### Agent Creator Story

- agent can create blog content using all available content (web content provided by agent provider, and user materials (if provided))
- agent can use embeddings to find relevant context
- agent can manage semantic search across all sources
- agent can prioritize user-provided reference materials when provided

#### Content Generation Flows

##### User-Led Process - User Story

- user starts writing… a title
- agent provider does a perplexity type search using Google Custom Search API
- generates multiple related content from various sources
- makes content available to agent creator
- agent creator starts autocompleting content as the user types using the content from the agent provider
- user accepts suggestions by pressing tab button or rejects by continuing to type
- as writing progresses, agent provider updates related content array
- agent creator uses updated content for more autocompletes
- continues until user concludes writing

##### AI-Led Process - User Story

- user can chat with ai to ask for title ideas
- agent creator offers suggestions
- user communicates their choice
- agent provider generates related content
- agent creator generates blog using related content
- user can request amendments
- if amendments require additional content
  - agent provider generates new related content
  - provides to agent creator
- agent creator generates revisions

#### System Instructions for Agent Creator

- User can set custom instructions
- instructions can include content style, tone, and writing style.
- Preset templates for custom instructions should be available
- user can save and access instruction history
- user can select instructions from history for any blog post creation

#### Reference Materials

Users can upload their own reference materials:

- Supported formats: PDF, DOC, DOCX, TXT
- Materials are processed and embedded for LLM use
- user can specify priority level for user materials
- user can toggle between using only user materials or including agent provider content

### Payment Page

- app can have separate premium service offerings for different services.
- Payment Page for paid services with payment options
- payment page should be integrated with a central payment processor and payment gateway.
- include a subscription management system for individuals and small businesses to manage their subscription.
- users can choose a selection of services to subscribe to and pay a single monthly subscription fee.

### Online Tools Page

- Hosts and provides access to various software applications developed within the APP.

### Contact Us Page

- Contact Us Page for visitors to send messages using a post route to an email address

### Registration Page

- Registration page for visitors to; Register with name and email to download forms, templates, documents, use online tools, etc.
- Register with authentication to subscribe to premium services.

### Product Promo Page

- Showcases product promotions, with links to detailed feature descriptions and payment options.

### Chatbot Integration

Offers multi-purpose assistance, including:

- Navigation guidance
- Lead generation
- Basic AI consulting services
- General customer support.

## AI-Powered Tools and Services

### JD Developer

Provide a form with key inputs from users. LLM will generate the JD based on system instructions and user inputs converted to queries

- guide: [integrated-hr-toolkit.md](./integrated-hr-toolkit.md)

### 2Do Task Manager

- LLM powered task manager that manages user tasks primarily using natural language by voice input.
- Provides feedback, status updates, reminders
- Synchronizes with user calendars for better schedule management.

### Calling Assistant (US Only)

- Makes calls on behalf of users and generates call transcript of the call.

### Training Plan and Curriculum Creator

- LLM-powered solution that develops personalized learning plans and curricula based on user learning goals.

- guide: [llmImplementation.md](./llmImplementation.md); [integrated-hr-toolkit.md](./integrated-hr-toolkit.md)

### Learning Content Creator

Uses an LLM to generate customized learning content tailored to individual user needs.

- guide: [llmImplementation.md](./llmImplementation.md)

### Knowledge GPT

- Functions as an expert educator and curator, providing structured knowledge materials across various domains.
- Serves as a subject matter expert providing information on a wide range of topics

- guide: [llmImplementation.md](./llmImplementation.md)

### Competency Manager

- LLM-powered tool that develops competency frameworks for any skill or industry

- guide: [llmImplementation.md](./llmImplementation.md); [integrated-hr-toolkit.md](./integrated-hr-toolkit.md)

### Competency Matrix Creator

- LLM-powered tool that creates competency matrices for any competency and for any industry.

- guide: [integrated-hr-toolkit.md](./integrated-hr-toolkit.md)

### InQDoc

Document Question Answering System that uses an llm to answer questions about documents.

- developed in a separate project: [inqdoc](https://inqdoc.synthalyst.com/)

This app will be integrated into the main app as a page.

### Synthalyst Form Builder

Web app that allows users to create forms with a drag and drop interface.

- contains forms, templates, web forms, and documents page for short descriptions of view only and downloadable forms and documents.

- developed in a separate project

This app will be integrated into the main app.

### Interview Questions Generator

App that generates interview questions based on user's input of job description and competency.

- Uses an LLM to generate interview questions based on user input.
- It is necessary to guide that input with form fields for industry, job level, role description, core competencies to evaluate and number of interview questions.

- User may enter the prompt directly or use the form.
- User may also only provide as much information they have available in the form and the gpt will craft the prompt based on information provided.

- The more fields completeted the more tailored the interview questions will be.

- The gpt should also provide tips on how to evaluate responses to the questions.

- The gpt should also provide a rubric for scoring the responses to the questions.

### Meeting Sec

This ai takes audio inputs, transcribes into notes and performs actions like creating minutes of meetings, scheduling calendar events, creating to-dos, sending emails with meeting notes to attendees, etc.

### Language Tutor / Translator

Learn any language for free!

- Select your language and the language you'd like to learn.
- Choose fluency goal and the time frame.
- Receive curated lessons, exercises, and practice materials.
- Practice with AI Tutor, track your progress and get personalized recommendations.
- OR go old school and practice listening and speaking with the AI Translator.
- Speak and hear the translation in the chosen language with transcription.
- Repeat the translation, get feedback on accuracy through written transcription or ai feedback.
- Repeat until your pronunciation score is satisfactory.

Need to communicate in a foreign language? Download the mobile app and use as two-way voice translation service!

### New Hire Induction Program Creator

System takes company information and directions on how to present the company information

- Welcome style and possible content
- Basic introduction
- Starter information e.g. play message from the CEO
- Other information flow and steps including presentation style, slides, video, etc
- concluding statements and actions, e.g., take a brief survey, clarify any segments, introduction to the buddy and the buddy program, etc.

## Other Apps

### Employee Turnover Calculator

web app that calculates employee turnover rates based on user's manual or uploaded input of employee exit data.

- developed in a separate project: [Turnover App](https://turnover-app.vercel.app/)

This app will be integrated into the main app as a page.

### Apartment Affordability Calculator

Web app that calculates the affordability of an apartment based on user's input of income, rent, utilities, etc.

- developed in a separate project: [Apartment Affordability Calculator](https://apartment-affordability-checker.vercel.app/)

This app will be integrated into the main app as a page.

### Resume Builder

Web app that allows users to build a professional resume in a few simple steps.

- The app will use an LLM to generate the resume following best practices for resume writing
- users can build their resume from scratch or use an existing template
- users can upload their existing resume, enter details of the job they will like to use the resume to apply for and the LLM will adapt the resume to best-suit the job requirements highlighting the user's relevant skills and experience that are most likely to get the user the interview.
- llm creates a cover letter for the user based on the job description and the user's resume
- users can download the resume as a PDF
- users can post the resume to their LinkedIn profile
- users can get feedback on their resume
- users can use the resume and cover letter to apply for jobs (this will be a paid service)

### Interview Prep App

Web app that allows users to prepare for interviews with the help of an LLM.

- users can add details of the job they will like to use the resume to apply for and the LLM will adapt the interview prep plan to best-suit the job requirements
- app can do a mock interview with the user and provide feedback on the user's performance (paid service)
- users can download the interview prep plan as a PDF
- users can post the interview prep plan to their LinkedIn profile
- users can get feedback on their interview prep plan
- users can use the interview prep plan to prepare for interviews (this will be a paid service)
