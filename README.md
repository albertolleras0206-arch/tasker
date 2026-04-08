# 📝 Tasker – Full Stack Task Management App

A full-stack task management application built with **Node.js, Express, MongoDB, and vanilla JavaScript**.
Users can register, log in, and manage their personal tasks with full CRUD functionality.

---

## 🚀 Features

* 🔐 User Authentication (JWT-based)
* 🧑‍💻 Register & Login system
* 🔒 Protected routes with middleware
* ✅ Create, Read, Update, Delete (CRUD) tasks
* 📌 Task status management:

  * `pending`
  * `in-progress`
  * `awaiting`
  * `done`
* 🎨 Simple frontend with vanilla JavaScript
* 🌐 RESTful API structure
* 🧱 MVC architecture (Model-View-Controller)

---

## 🏗️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JSON Web Tokens (JWT)
* dotenv

### Frontend

* HTML
* CSS
* JavaScript (Vanilla)

---

## 📁 Project Structure

```
tasker/
│
├── server/
│   ├── controllers/
│   │   └── taskController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── taskRoutes.js
│   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── tasks.html
│   ├── app.js
│   └── style.css
│
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/tasker.git
cd tasker
```

---

### 2. Install dependencies

```
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

```
npm run dev
```

Server will run on:

```
http://localhost:5000
```

---

### 5. Open the frontend

Open manually in your browser:

```
frontend/index.html
```

---

## 🔐 Authentication Flow

1. User logs in via `index.html`
2. Backend returns a JWT token
3. Token is stored in `localStorage`
4. Protected routes require:

   ```
   Authorization: Bearer <token>
   ```
5. Tasks page (`tasks.html`) is only accessible if authenticated

---

## 📡 API Endpoints

### Auth Routes

```
POST /api/auth/register
POST /api/auth/login
```

### Task Routes (Protected)

```
GET    /api/tasks        → Get all tasks
POST   /api/tasks        → Create task
PUT    /api/tasks/:id    → Update task
DELETE /api/tasks/:id    → Delete task
```

---

## 🧪 Testing

You can test the API using:

* Postman
* Thunder Client (VS Code)

---

## ⚠️ Known Issues / Notes

* Frontend is served locally (no deployment yet)
* CORS must be enabled on backend for frontend requests
* Tokens are stored in localStorage (for development purposes)

---

## 🚀 Future Improvements

* 🌐 Deploy backend (Render / Railway)
* ⚛️ Migrate frontend to React
* 📱 Improve UI/UX design
* 🗂️ Add task filtering & search
* ⏰ Add due dates and priorities
* 👥 Multi-user collaboration

---

## 👨‍💻 Author

**Alberto Lleras**

---

## 📄 License

This project is open-source and available under the MIT License.
