# Task Management App

A full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js), featuring user authentication, task filtering/sorting, and optional AI-generated task descriptions via OpenAI.

- 🌐 LIVE SITE: https://task-manger-missionperform.vercel.app/

---

## Project Structure
```
TASK-MANGER-MISSIONPERFORM/
├── backend/                        # Backend (Express.js + MongoDB)
│   ├── config/                     # Database configuration
│   ├── middleware/                # Auth middleware (e.g., token protection)
│   ├── models/                    # Mongoose schemas (User, Task)
│   ├── routes/                    # API route handlers (/auth, /tasks, /ai)
│   ├── node_modules/              # Backend dependencies
│   ├── .env                       # Environment variables for backend
│   ├── package.json               # Backend scripts and dependencies
│   ├── package-lock.json          # Backend lockfile
│   ├── .gitignore                 # Git ignore rules
│   └── server.js                  # Entry point for backend server
│
├── frontend/                      # Frontend (Next.js + Tailwind CSS)
│   ├── app/                       # Main layout and routing (Next.js app directory)
│   ├── components/               # UI components (AuthForms, Dashboard, etc.)
│   ├── lib/                       # Context providers, API wrappers, utilities
│   ├── node_modules/              # Frontend dependencies
│   ├── .gitignore                 # Git ignore rules
│   ├── components.json            # UI metadata (optional)
│   ├── eslint.config.mjs         # ESLint configuration
│   ├── next.config.ts            # Next.js configuration
│   ├── next-env.d.ts             # TypeScript environment typing
│   ├── postcss.config.js         # PostCSS config for Tailwind
│   ├── postcss.config.mjs        # (alt format) PostCSS config
│   ├── tailwind.config.js        # Tailwind theme and dark mode tokens
│   ├── tsconfig.json             # TypeScript config
│   ├── package.json              # Frontend scripts and dependencies
│   └── package-lock.json         # Frontend lockfile
└── README.md                 # project documentation (this file)
```
---

## Features

- JWT-based user authentication (register, login, logout)  
- Create, read, update, and delete tasks  
- Filter tasks by status (`To Do`, `In Progress`, `Done`)  
- Sort tasks by creation date, title, or status  
- Generate smart task descriptions using OpenAI  
- Responsive design with light/dark mode support  

---

## Technologies Used

### Frontend

- React (Next.js)  
- Tailwind CSS  
- Context API  
- Axios  

### Backend

- Node.js + Express.js  
- MongoDB + Mongoose  
- JWT for authentication
- OpenAI API  
- dotenv for config  

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js ≥ 18  
- MongoDB (local or Atlas)  
- OpenAI API Key (optional for AI feature)

### 1. Clone the Repository

```bash
git clone https://github.com/Ryan-Sadeghi-Javid/task-manger-missionperform.git
cd task-manger-missionperform
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
MONGO_URI=[INSERT_LOCAL_MONGO_URI]
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key [NOTE: FOR MISSIONPERFORM HIRING TEAM, I have put my personal OpenAI API key in the description of the YouTube video sent, for demoing purposes]
PORT=5000
```

Then start the server:

```bash
npm start
```

Server runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Then start the frontend server:

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

> ⚠️ No `.env.local` file is required in the frontend unless you plan to customize environment-specific variables (e.g., NEXT_PUBLIC_API_URL).

---

## Development Process & Decisions

### Iterative Development Workflow

I approached this project using an iterative design methodology:


- Started with core backend functionality (task CRUD + authentication)
- Did thorough testing of backend logic with postman
- Tested edge cases including creating a task with no title, retrieving a task with an invalid ID, updating a task that doesn't exist, etc
- Connected a simple frontend using `axios` to test flows manually  
- Gradually layered on UI polish, responsiveness, and bonus features like OpenAI integration

### Authentication (JWT + Context API)

- Implemented secure JWT-based login and registration
- Tokens are stored in `localStorage` and attached to all requests via Axios interceptors
- Auth state is managed globally with a custom AuthContext hook

### Task CRUD with Global State

- Created a TaskContext to manage all task-related logic (fetch, create, update, delete)
- This allowed every component (e.g., `TaskList`, `Dashboard`, `TaskForm`) to stay stateless and reusable
- `useEffect` auto-fetches tasks when the user logs in

### Clean, Responsive UI (Tailwind + Dark Mode)
- Styled with TailwindCSS for rapid prototyping and consistency
- Users can toggle themes via a dropdown, and the preference is stored in localStorage.
- Components were designed to be mobile-friendly with flex/grid layout responsiveness

### AI Integration (OpenAI API)
- Added a `/ai/generate-description` backend route that uses `OpenAI's GPT-4 Turbo model`
- On the frontend, clicking the ✨ icon in the form auto-generates a helpful task description
- This added a creative and practical touch to the otherwise standard CRUD flow

### Backend Best Practices
- Used Mongoose for schema validation and model relationships (user → tasks)
- Passwords are hashed with `bcryptjs` on registration
- Implemented middleware (`authMiddleware.js`) to protect task routes with token verification

---

## Challenges Faced

- **Synchronizing Global Authentication State**  
  One key challenge was managing authentication state (e.g. `user`, `error`, `loading`) globally while preserving a clean separation of concerns between UI and logic.  
  *Solution:* This was overcome by encapsulating all auth-related logic inside a dedicated `AuthContext`, allowing components to consume and react to state changes without direct API handling.

- **Persisting authentication using JWT tokens**  
  One key challenge was handling JWT-based authentication persistently across page reloads while keeping the implementation secure and user-friendly.  
  *Solution:* This was addressed by storing the token and username in `localStorage` upon successful login or registration. On initial load, a `useEffect` in the `AuthContext` checks for an existing token and sets it in the API client, restoring the user's session without requiring re-login.

- **Maintaining Frontend-Backend Decoupling**  
  Avoiding tight coupling between frontend and backend—especially for validation and error feedback—was a key concern.  
  *Solution:* I designed clean API response contracts and made the frontend handle error messaging generically through context-based error propagation, ensuring backend changes wouldn’t break the UI.

---
