# MERN Todo App: Fullstack CRUD with React, Express, MongoDB

[![Releases](https://img.shields.io/badge/releases-download-green?logo=github&logoColor=white)](https://github.com/huarcayadelacruzluisfernando/mern-todo-app/releases)

A complete MERN stack Todo application. It pairs a React frontend with an Express backend and MongoDB Atlas for data storage. Users can add, view, and delete daily tasks through a clean, modern UI and reliable API handling. The project demonstrates a practical approach to fullstack development, covering data flow from the client to the database, error handling, and responsive UI design. This README walks you through setup, usage, architecture, and best practices to extend and customize the app.

---

## Table of contents

- [Overview](#overview)
- [Key features](#key-features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment setup](#environment-setup)
- [Running the app locally](#running-the-app-locally)
- [API design](#api-design)
- [Data model](#data-model)
- [User interface and experience](#user-interface-and-experience)
- [Testing and quality](#testing-and-quality)
- [Deployment and hosting](#deployment-and-hosting)
- [Performance and security considerations](#performance-and-security-considerations)
- [Accessibility and internationalization](#accessibility-and-internationalization)
- [Development workflow and contributions](#development-workflow-and-contributions)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Release notes and artifacts](#release-notes-and-artifacts)
- [Credits and license](#credits-and-license)

---

## Overview

This project showcases a fully functional CRUD Todo app built with the MERN stack. It demonstrates how a modern web app can manage user tasks with real-time feedback, smooth UI state transitions, and a well-structured code base. The frontend is built in React, handling routing, components, and user interactions. The backend is an Express server that exposes a RESTful API to manage tasks stored in MongoDB Atlas. The architecture emphasizes clarity, scalability, and a clean separation of concerns between the client and the server.

The app is designed for learning and experimentation as well as practical use. You can adapt the UI to fit your design language, integrate additional features like user authentication, task categories, due dates, or reminders, and deploy it to your preferred hosting services.

To get the latest release assets, visit the Releases page of this repository. The release artifacts are prepared to simplify onboarding and provide a quick-start experience for developers who want to try the app with minimal setup. From the Releases page, download the release file and execute it in your environment to see the app in action. See the Releases section for details. The link is also available here: https://github.com/huarcayadelacruzluisfernando/mern-todo-app/releases.

[React logo](https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg) [Node.js logo](https://nodejs.org/static/images/logo.svg) [MongoDB logo](https://www.mongodb.com/assets/images/global/logo-mongodb.svg) [Express logo](https://upload.wikimedia.org/wikipedia/commons/6/6e/Expressjs.png)

---

## Key features

- Create, list, and remove tasks with a crisp, responsive UI
- Clear API endpoints for frontend-backend communication
- Separation of concerns with distinct client and server projects
- MongoDB Atlas as the primary data store for persistence
- Lightweight authentication scaffolding (optional) for future user-specific data
- Error handling and validation to improve reliability
- Environment-driven configuration to support local development and deployment
- Ready-to-use scripts for development and production workflows

Visual highlights include a modern color palette, accessible typography, and responsive layout that adapts from mobile to desktop seamlessly. The UI emphasizes speed and clarity, ensuring task management is a pleasant, distraction-free experience.

Images show the core tech stack in action. The React portion renders interactive components, the Express server handles API requests, and MongoDB Atlas serves as the persistent store.

---

## Tech stack

- Frontend: React, React Router, Axios (for HTTP requests), CSS/SCSS for styling
- Backend: Node.js, Express.js, Mongoose (MongoDB ODM), Cors, Dotenv
- Database: MongoDB Atlas (cloud-hosted)
- State and UI patterns: Functional components, hooks, and simple state management
- Build and tooling: Concurrent development setup, environment variables, npm scripts
- Optional: Docker for containerized deployment in advanced setups

This combination provides a familiar, well-supported environment for building modern web apps. It also aligns with common industry practices for API design, data modeling, and UI composition.

Logo references in this README illustrate the core components of the stack:
- React: React icon
- Node.js: Node.js logo
- MongoDB: MongoDB logo
- Express: Express.js logo

---

## Project structure

- client/           - React frontend
  - src/
    - components/   - Reusable UI components (TaskCard, TaskForm, etc.)
    - pages/        - Route pages (Home, About, etc.)
    - hooks/        - Custom React hooks for data fetching and state
    - styles/       - CSS/SCSS styles
    - utils/        - API utilities and helpers
  - public/         - Static assets and index.html
  - package.json    - Client-side dependencies and scripts
- server/           - Express backend
  - controllers/      - Request handlers for routes
  - models/           - Mongoose models (Task)
  - routes/           - API route definitions
  - middlewares/      - Error handling and validation
  - config/           - DB connection settings
  - app.js / index.js  - Server bootstrap
  - package.json      - Server dependencies and scripts
- .env.example      - Example environment variables
- README.md         - This documentation
- docker/            - Optional Docker-related files (Dockerfile, docker-compose.yml)

You will find a clean separation between client and server code. The client communicates with the API under the /api path, while the server handles database operations and business logic. This separation makes it easier to test each layer independently, swap out data stores, or implement user authentication with minimal friction.

---

## Getting started

This section guides you through the essentials to get the app running on your machine. It assumes a basic familiarity with Node.js and npm. If you prefer, you can adapt these steps to use Yarn or pnpm, but you would need to adjust the scripts accordingly.

1) Prerequisites
- Node.js: Install an LTS version (for example, Node.js 18.x or newer).
- npm: Comes with Node.js, but you can also use a package manager of your choice.
- MongoDB Atlas account: Create a cluster, set up a user, and whitelist your IP. Obtain the connection string for a non-admin user.

2) Clone the repository
- Use your preferred git client to clone the repository to your local machine.

3) Prepare environment variables
- Create a local copy of the environment file:
  - Copy .env.example to .env in the server folder.
  - Set MONGO_URI to your MongoDB Atlas connection string.
  - Set PORT for the backend (commonly 5000 or 3001).
  - If you enable authentication, add JWT_SECRET or other relevant tokens.
- In the client, you may set REACT_APP_API_URL to the base URL of your backend (for example http://localhost:5000).

4) Install dependencies
- Install server dependencies:
  - cd server
  - npm install
- Install client dependencies:
  - cd client
  - npm install

5) Start the development environment
- You can run the frontend and backend separately, or use a combined setup if you have a script.
- Start backend:
  - cd server
  - npm run dev (or npm start if you only have a single start script)
- Start frontend:
  - cd client
  - npm run start (or npm run build && serve if you prefer a static host)
- If you have a root-level script to run both in parallel, you can use npm run dev from the project root (with a suitable tool like concurrently). Adapt as needed to match your package.json configuration.

6) Verify the app
- Open the browser and navigate to the frontend host (e.g., http://localhost:3000).
- The UI should display the task list and allow adding, viewing, and deleting tasks.
- The backend should respond to API requests at the configured endpoints and persist data to MongoDB Atlas.

Note: The Releases page linked above contains prebuilt release artifacts. From that page, you can download the release file and execute it to quickly experience the app. The release artifacts are intended to simplify setup for developers who want a quick-start experience. Visit the Releases page to obtain the latest release artifacts and follow the instructions included with the file. You can always come back to the Releases section for updated builds.

For quick reference, the link appears here again: https://github.com/huarcayadelacruzluisfernando/mern-todo-app/releases.

---

## Environment setup

A solid environment setup helps avoid common pitfalls. This project uses environment variables to configure the backend and, optionally, the frontend.

- Backend configuration
  - MONGO_URI: The MongoDB Atlas connection string.
  - PORT: The port the server runs on for local development.
  - JWT_SECRET: A secret key used for token signing if authentication is enabled.
  - NODE_ENV: Set to development or production as appropriate.

- Frontend configuration
  - REACT_APP_API_URL: The base URL of the backend API. When running locally, this is typically http://localhost:5000 (or the port you configured).

- Local DB setup (optional)
  - If you want to run MongoDB locally for development, install MongoDB Community Server and set MONGO_URI to a local connection string like mongodb://localhost:27017/mern-todo.

- Security best practices
  - Do not commit secret values to version control. Use environment variables and a .env file in development.
  - When deploying, use encrypted environment variable storage provided by your hosting platform.

- Docker (optional)
  - If you prefer containerized development, you can create a docker-compose.yml to run both client and server together with a MongoDB Atlas-compatible connection.

This section centers on making the development environment predictable. The actual values and paths should be aligned with your local machine and hosting choices.

---

## Running the app locally

- Start the backend service first. It exposes a RESTful API for task management, including endpoints to fetch, create, update, and delete tasks.
- Start the frontend service second. It consumes the API, renders the task list, and allows user interactions.
- The app uses a responsive layout, so you can test on desktop, tablet, and mobile devices.

Common issues and fixes:
- If the frontend cannot reach the API, verify the API URL configuration and network access.
- If MongoDB Atlas refuses connections, ensure your IP whitelist includes your current IP and that the credentials have the right privileges.
- If the UI shows validation errors, check the server logs for validation messages and adjust frontend forms accordingly.

Remember: the Releases page provides a quick-start artifact. If you prefer to inspect the source code directly, you can run the app in development mode following the steps above, which gives you granular control over both frontend and backend code paths.

For a smooth experience, you can install a code editor with good TypeScript/JavaScript support, enable ESLint/Prettier, and enable automatic linting in your editor to keep the codebase clean as you modify or extend it.

The following image components illustrate the diverse parts of the MERN stack in this project:
- React UI components showcase how the frontend renders tasks and accepts user input.
- Express routes demonstrate how the API is structured to perform CRUD operations.
- MongoDB models reveal how data is stored and retrieved from the database.

React component and API design contribute to a predictable data flow. The client fetches data via Axios, handles responses, shows toast messages on success or error, and updates state accordingly. The server handles requests, interacts with Mongoose models, and returns JSON payloads with status messages. Together, these layers make the app robust and maintainable.

---

## API design

The backend exposes a clean RESTful API for task management. The following endpoints illustrate the typical interaction pattern:

- GET /api/tasks
  - Description: Retrieve all tasks
  - Response: Array of Task objects

- GET /api/tasks/:id
  - Description: Retrieve a single task by ID
  - Response: A Task object

- POST /api/tasks
  - Description: Create a new task
  - Body: { title: string, completed?: boolean, dueDate?: string }
  - Response: The created Task object

- PATCH /api/tasks/:id
  - Description: Update task fields
  - Body: Partial Task object (e.g., { completed: true })
  - Response: The updated Task object

- DELETE /api/tasks/:id
  - Description: Delete a task
  - Response: { success: true, id: string }

Data validation ensures every task has a title and reasonable values for completed and optional fields. The server returns meaningful HTTP status codes and JSON error messages to help the frontend handle errors gracefully.

---

## Data model

Task
- _id: ObjectId
- title: String (required)
- description: String (optional)
- completed: Boolean (default: false)
- createdAt: Date (default: now)
- updatedAt: Date (auto-updated)
- dueDate: Date (optional)

The model is designed to be simple yet extensible. You can easily add new fields like priority, category, or tags as your app evolves. Indexes can be added for faster sorting on fields like createdAt or dueDate.

---

## User interface and experience

The UI emphasizes clarity and ease of use. Core elements include:
- A clean header with branding and quick actions
- A responsive task list with subtle animations on add/delete
- A minimal form to create new tasks
- Quick filters to view all tasks, active tasks, or completed tasks
- Visual cues for task status via color and icons
- Keyboard accessibility for quick task creation and navigation

UI components are designed to be reusable and maintainable. Each component has a clear responsibility, reducing coupling and making it easier to extend the UI with features like drag-and-drop reordering, due date reminders, or task categorization.

Visual references:
- React-based components render the list and forms
- A responsive grid adapts to different screen sizes
- An accessible color scheme and large touch targets for mobile users

If you want to customize the look and feel, you can swap the CSS tokens or switch to a CSS-in-JS solution. The component structure supports theming and easy style overrides.

---

## Testing and quality

- Unit tests: Focus on isolated functions and utility methods, including data formatting and validation helpers.
- API tests: Validate all endpoints for success and failure scenarios, including authentication and authorization flows if implemented.
- Integration tests: End-to-end checks that exercise the client UI against a test instance of the backend.
- Linting and formatting: Enforce consistent coding style with ESLint and Prettier.
- Type safety: If you extend the project with TypeScript, add type checks and type guards to improve reliability.

Practices like code reviews and CI checks help maintain code quality as the project evolves. You can configure automated pipelines to run tests on pull requests and merges, ensuring that changes meet the project's standards.

---

## Deployment and hosting

- Frontend hosting: Deploy the React app on a static site host (Netlify, Vercel, GitHub Pages, or similar) with the API URL configured via environment variables or build-time configuration.
- Backend hosting: Deploy the Express server to a cloud platform (Heroku, Render, AWS, Azure, or similar). Use environment variables to configure the MongoDB Atlas connection and other secrets.
- Database: MongoDB Atlas remains the central data store. Ensure proper network access and user permissions in Atlas, including IP whitelisting, user roles, and a secure password.

Tips:
- Use a custom domain with TLS for secure communication.
- Enable proper CORS settings to allow your frontend origin to access the backend.
- Keep secrets out of code; rely on environment variables in production.
- Consider a separate staging environment to test changes before promoting them to production.

If you want a quick-start artifact, you can pull the latest release from the Releases page and run it as-is on your environment. The link to the Releases page is provided at the top of this README and again later in the document for your convenience.

From the Releases page, download the release file and execute it to quickly try the app in a prebuilt form. This is especially useful for getting feedback or demos without hunting down dependencies. The Releases URL appears at the beginning of this document and again in the Release notes section.

Releases page: https://github.com/huarcayadelacruzluisfernando/mern-todo-app/releases

---

## Performance and security considerations

- Performance
  - Use memoization for expensive computations in the frontend.
  - Paginate task results or implement infinite scrolling for large task sets.
  - Implement server-side validation to minimize round-trips and ensure data integrity.
  - Cache frequently accessed configuration data where appropriate.

- Security
  - Validate input on both client and server to prevent common security issues like injection attacks.
  - Use secure authentication and authorization patterns if you add user accounts.
  - Store sensitive information in environment variables and protect API routes with proper access checks.
  - Use HTTPS in production to encrypt data in transit.

These considerations help you build a robust, scalable app that remains reliable under load and resistant to basic threats.

---

## Accessibility and internationalization

- Accessibility
  - Provide semantic HTML, ARIA roles where appropriate, and keyboard-friendly navigation.
  - Use high-contrast color combinations and scalable font sizes to improve readability.
  - Ensure error messages are announced and actionable for assistive technologies.

- Internationalization
  - Structure the UI to support multiple languages with a simple translation layer.
  - Store text keys rather than hard-coded strings to simplify localization.
  - Provide a mechanism to switch languages at runtime.

The app’s design aims to be inclusive and usable by a broad audience while staying simple and fast.

---

## Development workflow and contributions

- Fork and clone the repository.
- Create a feature branch for your work.
- Implement changes with small, testable commits.
- Write or update tests to cover new functionality.
- Run the test suite locally before submitting a pull request.
- Submit a PR with a clear description of the changes and their intent.
- Engage in code reviews and respond to feedback promptly.

Code quality is important. Keep functions small and focused, name variables clearly, and document non-obvious decisions. If you extend the API, ensure you add tests to guard against regressions.

The project welcomes contributions that improve usability, add useful features, or enhance performance. If you plan a major change, discuss it via an issue first to align with project goals.

---

## Troubleshooting

- Frontend issues
  - If the UI doesn’t load, check the browser console for errors related to API calls or missing assets.
  - If styles don’t apply, verify that the CSS files are correctly imported and that the build process completed without errors.

- Backend issues
  - If the server can’t connect to MongoDB Atlas, verify the MONGO_URI, Atlas network access, and user permissions.
  - If API responses are slow, profile the endpoints and review database indexes.

- Deployment issues
  - Confirm environment variables are correctly set in the hosting environment.
  - Check logs for startup errors, port binding issues, or misconfigured domains.
  - Ensure the frontend can reach the backend with the correct CORS and base URL settings.

If you run into a problem that you can’t solve quickly, check the Releases section for a prebuilt artifact that you can run to verify your environment, then compare it with the source for clues. The link to the Releases page is placed at the top of this document and mentioned again in the Release notes section.

---

## Roadmap

- User authentication and multi-user task management
- Task categories, due dates, and reminders
- Local storage fallback for offline use
- Offline-first syncing and conflict resolution
- Enhanced search and advanced filters
- Desktop and mobile-specific UI refinements
- Accessibility improvements and internationalization enhancements
- Unit and integration test coverage expansion
- Dockerized development and production environments

The roadmap is a living document. If you have ideas or want to contribute specific features, open an issue or submit a pull request with a detailed description and acceptance criteria. Your input helps shape the project’s direction and ensures it remains useful to a broad set of developers.

---

## Release notes and artifacts

Releases provide prebuilt artifacts to help you test and run the app quickly. The latest release includes a downloadable file suitable for quick setup. From the Releases page, download the release file and execute it to see the app in action. If you prefer to work directly from source, you can skip the artifact and run the development setup described earlier.

Releases page link (used again here): https://github.com/huarcayadelacruzluisfernando/mern-todo-app/releases

To ensure you’re referencing the right artifact, always check the release notes for version numbers, platform compatibility, and any post-release migration steps. The notes may also point out breaking changes or important configuration updates.

---

## Credits and license

- Project author: Luis Fernando
- Contributors: Open to community contributions
- License: MIT License (or your chosen license). The license text should be included in the LICENSE file in the repository.

Acknowledgments go to the libraries and tools that enable this project. The device/computer you’re using to view and modify this repository is part of the broader ecosystem that makes modern web development possible. If you publish your own forks or variants, please cite the original project and provide a link back to the source to help others discover this work.

Images used in this README reflect the stack and UI components. Where applicable, logos are used to illustrate the core technologies in the MERN stack. Replace or update these assets as needed to reflect your project style and branding.

---

## Downloads and release artifacts (quick access)

- Release artifacts are available on the Releases page. For a quick start, visit the Releases page and download the latest release file, then execute it according to the provided instructions. This path provides a fast way to see the app in action without building from source.

- The Releases page can be accessed via this link again: https://github.com/huarcayadelacruzluisfernando/mern-todo-app/releases

- Note: The link above contains a path (releases). If you’re downloading an artifact, you should download the file indicated in the release notes and execute it on your machine. For a deeper dive into how the app is built, you can also explore the source code in this repository and run the development environment locally as described in the Getting started and Running the app locally sections.

---

## Visual references and diagrams

- Architecture diagram showing the flow: React frontend communicates with Express REST API, which talks to MongoDB Atlas.
- Data flow diagrams illustrating how a new task is created, saved, and displayed.
- UI screenshots or mockups illustrating the TaskCard, TaskForm, and filtering controls.
- Logos and icons from established sources to reflect stack components, including React, Node.js, MongoDB, and Express where appropriate.

If you want to add more visuals, place them in the docs or README with descriptive captions. Visuals help new users understand the structure and flow more quickly.

---

End of documentation.