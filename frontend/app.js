//obtain global state 
let token = localStorage.getItem("token");
let currentProjectId = localStorage.getItem("projectId");
const path = window.location.pathname;

//get user ID 
function getUserFromToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

const currentUser = getUserFromToken(token);

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

      li.className = "list-group-item d-flex justify-content-between align-items-center";

      li.innerHTML = `
        <span>${project.name}</span>

        <div class="btn-group">
          <button class="btn btn-sm btn-success" onclick="openProject('${project._id}', '${project.name}')">
            Open
          </button>
          <button class="btn btn-sm btn-warning" onclick="editProject('${project._id}', '${project.name}')">
            Edit
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteProject('${project._id}')">
            Delete
          </button>
        </div>
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

    const data = await res.json();

    if (!res.ok) {
      console.error("Error fetching tasks:", data.message);
      return;
    }

    const list = document.getElementById("taskList");
    if (!list) return;

    list.innerHTML = "";

    data.forEach(task => {
      const li = document.createElement("li");
      li.className = "list-group-item";

      li.innerHTML = `
        <div class="mb-2">
          <!-- TITLE -->
          <input 
            class="form-control"
            value="${task.title}"
            ${!isOwner ? "disabled" : ""}
            onchange="updateTask('${task._id}', { title: this.value })"
          />
        </div>


        <div class="d-flex flex-wrap gap-2 align-items-center">

          <!-- ASSIGN -->
          <select 
            class="form-select w-auto"
            ${!isOwner ? "disabled" : ""}
            onchange="updateTask('${task._id}', { assignedTo: this.value || null })"
          >
            <option value="">Unassigned</option>
            ${projectMembers.map(member => `
              <option value="${member._id}"
                ${task.assignedTo && task.assignedTo._id === member._id ? "selected" : ""}>
                ${member.name}
              </option>
            `).join("")}
          </select>

          <!-- STATUS -->
          <select 
            class="form-select w-auto"
            onchange="updateTask('${task._id}', { status: this.value })"
          >
            <option value="pending" ${task.status === "pending" ? "selected" : ""}>Pending</option>
            <option value="in-progress" ${task.status === "in-progress" ? "selected" : ""}>In Progress</option>
            <option value="done" ${task.status === "done" ? "selected" : ""}>Done</option>
          </select>

          <!-- DUE DATE -->
          <span class="badge bg-secondary">
            ${
              task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No due date"
            }
          </span>

          <!-- DELETE -->
          ${isOwner ? `
            <button class="btn btn-sm btn-danger ms-auto" onclick="deleteTask('${task._id}')">
              Delete
            </button>
          ` : ""}
        </div>
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
    const dueDate = document.getElementById("taskDueDate").value;

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
        dueDate: dueDate || null
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error creating task");
      return;
    }

    input.value = "";
    getTasks(); //refresh list

  } catch (error) {
    console.error(error);
  }
}

// UPDATE TASK STATUS, FUTURE FIELDS OR TITLE
async function updateTask(id, updates) {
  try {
    const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(updates)
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
    const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to delete task");
      return;
    }

    getTasks();

  } catch (error) {
    console.error(error);
  }
}

//project members and assignment
let projectMembers = [];
let isOwner = false;

async function loadProjectMembers() {
  try {
    const res = await fetch(`http://localhost:5000/api/projects/${currentProjectId}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Error loading members:", data.message);
      return;
    }

    projectMembers = data.members || [];

    //owner ID
    const ownerId = typeof data.owner === "object"
      ? data.owner._id
      : data.owner;

    //user id 
    const userId =
      currentUser?.id ||
      currentUser.id ||
      currentUser?.user?.id;

    //check if current user is owner
    isOwner = ownerId.toString() === userId?.toString();

  } catch (error) {
    console.error(error);
  }
}

// UI
//load projects on projects page
document.addEventListener("DOMContentLoaded", async () => {
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
      projectTitle.textContent = "Project: " + projectName;
    }

    if (!currentProjectId) {
      window.location.href = "projects.html";
      return;
    }

    await loadProjectMembers();
    getTasks();
  }
});


// LOGOUT
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

//global functions
window.editProject = editProject;
window.deleteProject = deleteProject;
window.openProject = openProject;
window.deleteTask = deleteTask;
window.updateTask = updateTask;