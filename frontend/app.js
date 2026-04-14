//obtain global state 
let token = localStorage.getItem("token");
let currentProjectId = localStorage.getItem("projectId");
const path = window.location.pathname;

// Clean invalid tokens
if (token === "undefined" || token === "null") {
  localStorage.removeItem("token");
  token = null;
}

// route protection

// If NOT logged in → block protected pages
if ((path.endsWith("tasks.html") || path.endsWith("projects.html")) && !token) {
  window.location.replace("index.html");
}

// If logged in → block login page
if ((path.endsWith("index.html") || path.endsWith("register.html")) && token) {
  window.location.replace("projects.html");
}

// If on tasks page without project → block
if (path.endsWith("tasks.html") && !currentProjectId) {
  window.location.href = "projects.html";
}

// ======== AUTH FORM TOGGLE ========
let isLogin = true; // true = login, false = register/error

function toggleForm() {
  isLogin = !isLogin;

  const formTitle = document.getElementById("form-title");
  const submitBtn = document.getElementById("submit-btn");
  const toggleText = document.getElementById("toggle-text");
  const nameGroup = document.getElementById("name-group");
  const toggleLink = document.getElementById("toggle-link");

  if (!formTitle || !submitBtn || !toggleText || !nameGroup) return;

  formTitle.innerText = isLogin ? "Login" : "Register";
  submitBtn.innerText = isLogin ? "Login" : "Register";

  toggleText.innerText = isLogin
    ? "Don't have an account?"
    : "Already have an account?";

  //login
  toggleLink.innerText = isLogin ? "Register" : "Login";

  //show name for registration
  nameGroup.style.display = isLogin ? "none" : "block";
}

// ======== HANDLE LOGIN OR REGISTER ========
async function handleSubmit() {
  try {
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    const body = isLogin
      ? { email, password }
      : {
        name: document.getElementById("name")?.value,
        email,
        password,
      };

    const res = await fetch(`http://localhost:5000${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error occurred");
      return;
    }

    if (isLogin) {
      localStorage.setItem("token", data.token);
      window.location.href = "projects.html";
    } else {
      alert("User registered successfully! You can now log in.");
      toggleForm(); // Switch to login after successful registration
    }

  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
}

// PROJECTS

// LOAD PROJECTS

//load projects on projects page
async function loadProjectsPage() {
  try {
    const res = await fetch("http://localhost:5000/api/projects", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const projects = await res.json();

    const list = document.getElementById("projectList");
    if (!list) return;

    list.innerHTML = "";

    projects.forEach((project) => {
      const li = document.createElement("li");

      li.innerHTML = `
       <span>${project.name}</span>

      <button onclick="openProject('${project._id}', '${project.name}')">
       Open Tasks
      </button>
      <button onclick="editProject('${project._id}', '${project.name}')">
      Edit
      </button>
      <button onclick="deleteProject('${project._id}')">
       Delete
      </button>
      `;

      list.appendChild(li);
    });

  } catch (error) {
    console.error(error);
  }
}

// CREATE PROJECT
async function createProject() {
  try {
    const input = document.getElementById("projectName");
    const name = input.value.trim();

    if (!name) {
      alert("Project name is required");
      return;
    }

    const res = await fetch("http://localhost:5000/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Error creating project");
      return;
    }

    input.value = "";
    loadProjectsPage();
  } catch (error) {
    console.error(error);
  }
}

async function editProject(projectId, currentName) {
  const newName = prompt("Edit project name:", currentName);

  if (!newName || newName.trim() === "") return;

  try {
    const res = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ name: newName }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error updating project");
      return;
    }

    loadProjectsPage(); // refresh list

  } catch (error) {
    console.error(error);
  }
}

async function deleteProject(projectId) {
  const confirmDelete = confirm("Are you sure you want to delete this project? This action cannot be undone.");

  if (!confirmDelete) return;

  try {
    const res = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Error deleting project");
      return;
    }

    loadProjectsPage(); // refresh list

  } catch (error) {
    console.error(error);
  }
}


//open project
function openProject(projectId, projectName) {

  console.log("Click worked:");

  localStorage.setItem("projectId", projectId);
  localStorage.setItem("projectName", projectName);

  window.location.href = "tasks.html";
}

// GET TASKS
async function getTasks() {
  try {
    const res = await fetch(`http://localhost:5000/api/tasks/project/${currentProjectId}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const tasks = await res.json();

    const list = document.getElementById("taskList");
    if (!list) return;

    list.innerHTML = "";

    tasks.forEach(task => {
      const li = document.createElement("li");

      li.innerHTML = `
      <li>
        <input value="${task.title}" onchange="updateTask('${task._id}', this.value)" />
        <select onchange="updateStatus('${task._id}', this.value)">
        <option value="pending" ${task.status === "pending" ? "selected" : ""}>Pending</option>
        <option value="in-progress" ${task.status === "in-progress" ? "selected" : ""}>In Progress</option>
        <option value="done" ${task.status === "done" ? "selected" : ""}>Done</option>
        </select>
        <button onclick="deleteTask('${task._id}')">❌</button>
      </li>
    `;
      list.appendChild(li);
    });

  } catch (error) {
    console.error(error);
  }
}

// CREATE TASK
async function createTask() {
  try {
    const input = document.getElementById("taskTitle");
    const title = input.value.trim();

    if (!title) {
      alert("Task title is required");
      return;
    }

    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        title,
        projectId: currentProjectId,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || "Error creating task");
      return;
    }

    input.value = "";
    getTasks();

  } catch (error) {
    console.error(error);
  }
}

// UPDATE TASK STATUS
async function updateTask(id, title) {
  try {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ title })
    });

    const data = await res.json();

    if (!res.ok) {
  
      alert(data.message || "Failed to update task");
      return;
    }

    getTasks();

  } catch (error) {
    console.error(error);
  }
}

// DELETE TASK
async function deleteTask(id) {
  try {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    getTasks();

  } catch (error) {
    console.error(error);
  }
}

// UI
//load projects on projects page
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  //projects page
  if (path.endsWith("projects.html")) {
    loadProjectsPage();
  }

  //tasks page
  if (path.endsWith("tasks.html")) {
    const projectName = localStorage.getItem("projectName");
    const projectTitle = document.getElementById("project-title");

    if (projectTitle && projectName) {
      projectTitle.textContent = projectName;
    }
  }
  getTasks();

});


// LOGOUT
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// AUTO LOAD TASKS 
if (window.location.pathname.includes("tasks.html")) {
  getTasks();
}


window.editProject = editProject;
window.deleteProject = deleteProject;
window.openProject = openProject;