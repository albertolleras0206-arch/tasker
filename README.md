# Tasker 🧩

Tasker is a full-stack task management application that allows users to organize work into projects and collaborate with multiple users.

Built using **Node.js, Express, MongoDB, and Vanilla JavaScript**, the application supports authentication, project-based task organization, and role-based permissions.

---

## 🚀 Features

### 🔐 Authentication

* User registration and login
* JWT-based authentication
* Protected routes

### 📁 Projects

* Create projects
* Each project has:

  * Owner
  * Members
* Only project members can access project data

### ✅ Tasks

* Tasks belong to a specific project
* Create, view, update, and delete tasks
* Default task status: `pending`

### 🔒 Role-Based Permissions

* **Project Owner**

  * Can update task status
  * Can delete tasks
* **Project Members**

  * Can view tasks
  * Cannot modify or delete tasks

---

## 🧱 Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Tokens (JWT)

### Frontend

* HTML
* CSS
* Vanilla JavaScript

---

## 📂 Project Structure

```
tasker/
│
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── projectController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   └── Project.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   └── projectRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── projects.html
│   ├── tasks.html
│   ├── app.js
│   └── style.css
│
└── README.md
```

---

## 🔄 Application Flow

```
Login → Projects Page → Select Project → Tasks Page
```

1. User logs in
2. Redirected to **Projects Dashboard**
3. User creates or selects a project
4. User navigates to **Tasks Page**
5. Tasks are managed within the selected project

---

## 🔌 API Endpoints

### 🔐 Auth

```
POST /api/auth/register
POST /api/auth/login
```

---

### 📁 Projects

```
GET    /api/projects
POST   /api/projects
PUT    /api/projects/:id (owner only)
DELETE /api/projects/:id (owner only)
```

---

### ✅ Tasks

#### Create Task

```
POST /api/tasks
Body:
{
  "title": "Task name",
  "projectId": "project_id"
}
```

#### Get Tasks by Project

```
GET /api/tasks/project/:projectId
```

#### Update Task (Owner Only)

```
PUT /api/tasks/:id
Body:
{
  "status": "in-progress"
}
```

#### Delete Task (Owner Only)

```
DELETE /api/tasks/:id
```

---

## 🔐 Authorization Logic

### Project Access

A user can access a project if:

* They are the **owner**, OR
* They are included in the **members array**

### Task Permissions

| Action       | Owner | Member |
| ------------ | ----- | ------ |
| View Tasks   | ✅     | ✅      |
| Create Tasks | ✅     | ✅      |
| Update Tasks | ✅     | ❌      |
| Delete Tasks | ✅     | ❌      |

---

## 🧠 Key Design Decisions

* Tasks are **scoped to projects**
* Permissions are enforced at both:

  * Backend (security)
  * Frontend (UX)
* JWT is used for stateless authentication
* MVC architecture keeps code modular and scalable

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/your-username/tasker.git
cd tasker
```

### 2. Install dependencies

```
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file in `/server`:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

### 4. Run the server

```
npm run dev
```

### 5. Open frontend

Open:

```
frontend/index.html
```

---

## 🧪 Future Improvements

* Invite users to projects
* Assign tasks to specific users
* Add deadlines and priorities
* Real-time updates (Socket.io)
* UI improvements (Kanban board)

---

## 👨‍💻 Author

Built by >Alberto Lleras 🚀

---
