# 🧠 Tasker — Full Stack Task Management App

Tasker is a full-stack task management application that allows users to create projects, manage tasks, and collaborate with role-based permissions. The application follows a clean MVC architecture and uses vanilla JavaScript on the frontend.

---

## 🚀 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Tokens (JWT)

### Frontend
- HTML
- CSS
- Vanilla JavaScript (no frameworks)

---

## 📁 Project Structure (MVC)
tasker/
│
├── frontend/
│ ├── app.js
│ ├── index.html
│ ├── projects.html
│ ├── tasks.html
│ └── style.css
│
├── server/
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── projectController.js
│ │ └── taskController.js
│ │
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ └── projectMiddleware.js
│ │
│ ├── models/
│ │ ├── Project.js
│ │ ├── Task.js
│ │ └── User.js
│ │
│ ├── routes/
│ │ ├── auth.js
│ │ ├── projectRoutes.js
│ │ └── taskRoutes.js
│ │
│ └── utils/
│ └── projectHelper.js
│
├── package.json
├── package-lock.json
├── README.md
└── server.js



---

## 🔐 Authentication

- JWT-based authentication
- Users can register and log in
- Token is stored in `localStorage`
- Protected routes are secured using `authMiddleware`

---

## 📁 Projects System

### Features
- Create projects
- View all projects (owner + members)
- Update project name ✏️
- Delete project 🗑️
- Add members by email (owner only)
- Remove members (owner only)

### Project Model
- `name`
- `owner` (User reference)
- `members` (Array of Users)

### Permissions
- **Owner**
  - Can edit project
  - Can delete project
  - Can manage members
- **Members**
  - Can only view projects

### Validation
- Prevent duplicate project names per user

---

## ✅ Tasks System

### Features
- Create tasks within a project
- View tasks by project
- Update task title
- Update task status (`pending`, `in-progress`, `awaiting`, `done`)
- Delete tasks

### Task Model
- `title`
- `status`
- `user` (creator)
- `project` (reference to Project)

---

## 🔒 Authorization Rules

### Project Access
A user can access a project if:
- They are the **owner**, or
- They are included in the **members list**

### Task Permissions
- **Owner**
  - Can create, update, and delete tasks
- **Members**
  - Can only view tasks

---

## 🌐 Frontend

### Pages
- `index.html` → Login/Register
- `projects.html` → Manage projects
- `tasks.html` → Manage tasks inside a project

---

## 🔄 Application Flow
Login → Projects → Select Project → Tasks
---

## 🧠 State Management

- `token` stored in `localStorage`
- `projectId` stored when selecting a project
- `projectName` stored for display in tasks page

---

## 🔗 API Endpoints

### Auth
POST /api/auth/register
POST /api/auth/login

### Projects
GET /api/projects
POST /api/projects
PUT /api/projects/:projectId
DELETE /api/projects/:projectId
POST /api/projects/:projectId/members
DELETE /api/projects/:projectId/members/:userId

### Tasks
GET /api/tasks/project/:projectId
POST /api/tasks
PUT /api/tasks/:taskId
DELETE /api/tasks/:taskId


---

## ⚙️ Key Fixes & Improvements

- Fixed route protection logic (operator precedence bug)
- Fixed `projectId` not being stored properly between pages
- Fixed `openProject()` not executing due to global scope issue
- Fixed frontend issues caused by using `file://` instead of a local server
- Fixed backend crash due to undefined `isMember` variable
- Implemented reusable helper:
  ```js
  isProjectMember(project, userId)

----
  📌 Current Status
Authentication system complete
Projects CRUD complete
Tasks CRUD complete
Role-based backend permissions implemented
Frontend fully functional
Navigation and state management working correctly

----
🚧 Future Improvements
Role-based UI (hide actions for non-owners)
Assign tasks to specific users
Add due dates to tasks
Kanban board (Trello-style interface)
Notifications / activity tracking