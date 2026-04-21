# 🚀 Tasker - Full Stack Task Management App

Tasker is a full-stack task management application built with Node.js, Express, MongoDB, and Vanilla JavaScript. It allows users to manage projects, collaborate with team members, and track tasks efficiently.

---

## 🧠 Features

### 🔐 Authentication

- User registration and login
- JWT-based authentication
- Protected routes and session handling

### 📁 Projects

- Create, read, update, and delete projects
- Project ownership system
- Add/remove project members
- Role-based access:
  - Owner → full control
  - Members → read-only access

### ✅ Tasks

- Create, update, delete tasks
- Tasks linked to specific projects
- Task status management:
  - Pending
  - In Progress
  - Done

- Assign tasks to project members
- Real-time UI updates

### ✏️ Task Editing (Modal)

Tasks can now be edited through a clean and user-friendly modal interface.

**Features:**

- Edit task title
- Update task status (Pending, In Progress, Done)
- Modify due date
- Changes are saved instantly to the database
- UI refreshes automatically after update

**UX Improvements:**

- Replaces reliance on inline editing
- Cleaner and more intuitive interaction
- Uses Bootstrap modal for a smoother experience

---

## 🏗️ Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

### Frontend

- HTML
- CSS
- Vanilla JavaScript (no frameworks)

---

## 📂 Project Structure

````
tasker/

frontend/
  app.js
  index.html
  projects.html
  tasks.html
  style.css

server/
  controllers/
  models/
  routes/
  middleware/
  utils/

.env
package.json
README.md


---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/tasker.git
cd tasker
````

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Create `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

### 4. Run the server

```bash
npm run dev
```

---

### 5. Open in browser

```
http://localhost:5000
```

---

## 🔄 Application Flow

1. User logs in or registers
2. Redirected to Projects page
3. Create or select a project
4. Navigate to Tasks page
5. Manage tasks (CRUD, status, assignment)

---

## 🔒 Authorization Rules

- Only project members can view tasks
- Only project owner can:
  - Edit/delete tasks
  - Assign tasks
  - Modify project

---

## 🐞 Bugs Fixed During Development

- Fixed route protection logic
- Fixed localStorage issues (projectId persistence)
- Fixed frontend `file://` execution issue
- Fixed controller crashes (undefined variables)
- Fixed async/await UI rendering issues
- Fixed incorrect request payload structure
- Fixed schema typo (`assignedTo`)

---

## 🚧 Future Improvements

- Role-based UI (hide controls for members)
- Kanban board (Trello-style interface)
- Due dates for tasks
- Notifications system
- Drag-and-drop task management

## 🚀 Recent Updates

- Added task editing modal
- Implemented full task update (title, status, due date)
- Fixed timezone issue causing incorrect due date display
- Improved overall task management UX

---

## 👨‍💻 Author

**Alberto Lleras**

---

📄 License

This project is open-source and available under the MIT License.
