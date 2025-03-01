# Project Brief - Synthalyst Web App

This app can be described as a Comprehensive Business and Productivity Platform designed to offer a blend of content, digital tools, and AI-powered services to individuals and businesses. It serves as a hub for professional development, productivity enhancement, and business solutions.

## Purpose & Value Proposition

This app aims to be a one-stop platform for professionals and businesses seeking:

- Expert content and on-demand consulting.
- Custom document and task management solutions.
- AI-powered learning and competency development tools.
- End-to-end digital support from job description drafting to upskilling and productivity optimization.

The platform's fusion of content, commerce, AI-powered tools, and advisory services distinguishes it as a next-generation professional ecosystem.

## Core Pages and Features

### Home Page

- Highlights APP contents with navigational links to all core pages.
- Displays live counts (e.g., downloads, clients, visitors, etc.) and client testimonials.
- Provides social media links for external engagement.

### Blog Page

- Supports blog postings with a comments section for user interaction.
- Includes links to related articles, referenced content, and other relevant APP pages.

### Payment Page

- Payment Page for paid services with payment options

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

### 2Do Task Manager

- LLM powered task manager that manages user tasks primarily using natural language by voice input.
- Provides feedback, status updates, reminders
- Synchronizes with user calendars for better schedule management.

### Calling Assistant (US Only)

- Makes calls on behalf of users and generates call transcript of the call.

### Training Plan and Curriculum Creator

- LLM-powered solution that develops personalized learning plans and curricula based on user learning goals.

- guide: [llmImplementation.md](./llmImplementation.md)

### Learning Content Creator

Uses an LLM to generate customized learning content tailored to individual user needs.

- guide: [llmImplementation.md](./llmImplementation.md)

### Knowledge GPT

- Functions as an expert educator and curator, providing structured knowledge materials across various domains.
- Serves as a subject matter expert providing information on a wide range of topics

- guide: [llmImplementation.md](./llmImplementation.md)

### Competency Manager

- LLM-powered tool that develops competency frameworks for any skill or industry

- guide: [llmImplementation.md](./llmImplementation.md)

### Competency Matrix Creator

- LLM-powered tool that creates competency matrices for any competency and for any industry.

### InQDoc

Document Question Answering System that uses an llm to answer questions about documents.

- developed in a separate project: [inqdoc](https://inqdoc.synthalyst.com/)

This app will be integrated into the main app as a page.

### Synthalyst Form Builder

Web app that allows users to create forms with a drag and drop interface.

- contains forms, templates, web forms, and documents page for short descriptions of view only and downloadable forms and documents.

- developed in a separate project

This app will be integrated into the main app.

### The Synth Blog

Blog app powered by two LLMs, an agent provider and agent creator.

- developed in a separate project: [synth-blog](https://synth-blog.vercel.app/)

This app will be integrated into the main app as a page.

### Employee Turnover Calculator

web app that calculates employee turnover rates based on user's manual or uploaded input of employee exit data.

- developed in a separate project: [Turnover App](https://turnover-app.vercel.app/)

This app will be integrated into the main app as a page.

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

- Speak and hear the translation in the chosen language with transcription.
- Repeat the translation, get feedback on accuracy through written transcription or ai feedback.
- Repeat until your pronunciation score is satisfactory.

Need to communicate in a foreign language? use as two-way voice translation service!

### New Hire Induction Program Creator

System takes company information and directions on how to present the company information

- Welcome style and possible content
- Basic introduction
- Starter information e.g. play message from the CEO
- Other information flow and steps including presentation style, slides, video, etc
- concluding statements and actions, e.g., take a brief survey, clarify any segments, introduction to the buddy and the buddy program, etc.

### Apartment Affordability Calculator

Web app that calculates the affordability of an apartment based on user's input of income, rent, utilities, etc.

- developed in a separate project: [Apartment Affordability Calculator](https://apartment-affordability-checker.vercel.app/)

This app will be integrated into the main app as a page.
