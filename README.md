# 🧠 Task Manager API

A RESTful API for managing tasks with user authentication, built using Node.js, Express, and MongoDB. This project demonstrates full backend development with secure authentication, protected routes, and complete CRUD functionality.

---

## 🚀 Features

* 🔐 User Authentication (JWT)
* 🛡️ Protected Routes (only authenticated users can access tasks)
* 📋 Task Management (CRUD operations)
* 🔎 Filter tasks by status
* 🔍 Search tasks by title
* 🧱 MVC Architecture (Models, Controllers, Routes)
* 🌐 MongoDB database integration

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JSON Web Tokens (JWT)
* **Testing:** Postman
* **Version Control:** Git & GitHub

---

## 📂 Project Structure

```
server/
│
├── models/
│   ├── User.js
│   └── Task.js
│
├── controllers/
│   ├── authController.js
│   └── taskController.js
│
├── routes/
│   ├── auth.js
│   └── taskRoutes.js
│
├── middleware/
│   └── authMiddleware.js
│
├── .env
├── server.js
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/tasker.git
cd tasker
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Configure environment variables

Create a `.env` file in the root:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

### 4. Run the server

```bash
npm run dev
```

Server will start on:

```
http://localhost:5000
```

---

## 🔐 Authentication Endpoints

### Register User

```http
POST /api/auth/register
```

```json
{
  "name": "John Doe",
  "email": "john@test.com",
  "password": "password123"
}
```

---

### Login User

```http
POST /api/auth/login
```

```json
{
  "email": "john@test.com",
  "password": "password123"
}
```

Returns a JWT token:

```json
{
  "token": "your_jwt_token"
}
```

---

## 📋 Task Endpoints

> All routes below require authentication
> Add header: `Authorization: Bearer <token>`

---

### Create Task

```http
POST /api/tasks
```

```json
{
  "title": "Finish backend project",
  "status": "pending"
}
```

---

### Get All Tasks

```http
GET /api/tasks
```

---

### Filter Tasks by Status

```http
GET /api/tasks?status=pending
```

---

### Search Tasks

```http
GET /api/tasks?search=backend
```

---

### Update Task

```http
PUT /api/tasks/:id
```

```json
{
  "status": "in-progress"
}
```

---

### Delete Task

```http
DELETE /api/tasks/:id
```

---

## 📌 Task Status Options

* `pending`
* `in-progress`
* `awaiting`
* `done`

---

## 🧠 What This Project Demonstrates

* Building RESTful APIs with Express
* Implementing authentication with JWT
* Securing routes with middleware
* Structuring a backend using MVC
* Performing CRUD operations with MongoDB
* Handling real-world debugging and errors

---

## 🚀 Future Improvements

* Frontend UI (Trello-style board)
* Task priorities and deadlines
* Task dependencies
* User profile management
* Deployment (Render / Vercel / Railway)

---

## 👨‍💻 Author

**Alberto Lleras**

---

## ⭐️ Show your support

If you like this project, feel free to star the repository ⭐️
