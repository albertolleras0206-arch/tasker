let token = localStorage.getItem("token");
let currentProjectId = localStorage.getItem("projectId");

const path = window.location.pathname;

// Clean invalid tokens
if (token === "undefined" || token === "null") {
  localStorage.removeItem("token");
  token = null;
}

// If NOT logged in → block tasks page
if (path.endsWith("tasks.html") || path.endsWith("projects.html") && !token) {
  window.location.replace("index.html");
}

// If logged in → block login page
if ((path.endsWith("index.html") || path.endsWith("register.html") && token) && token) {
  window.location.replace("projects.html");
}

// ======== AUTH FORM TOGGLE ========
let isLogin = true; // true = login, false = register

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

  toggleLink.innerText = isLogin ? "Register" : "Login";

  //show name for registration
  nameGroup.style.display = isLogin ? "none" : "block";
}

// ======== HANDLE LOGIN OR REGISTER ========
async function handleSubmit() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

  const body = isLogin
    ? { email, password }
    : { name: document.getElementById("name")?.value, 
      email,
       password 
      };
  
  const res = await fetch(`http://localhost:5000${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json(); 

  if (!res.ok) {
    alert(data.message);
    return;
  }

  if(isLogin){
    localStorage.setItem("token", data.token);
    window.location.href = "projects.html"; 
  } else {
    alert("User registered successfully! You can now log in.");
    toggleForm(); // Switch to login after successful registration
  } 

  try {
    const res = await fetch(`http://localhost:5000${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    // Login flow
    if (isLogin && data.token) {
      token = data.token;
      localStorage.setItem("token", token);
      window.location.href = "projects.html";
    }
    // Register flow
    else if (!isLogin) {
      alert("User registered successfully! You can now log in.");
      toggleForm(); // Switch to login after successful registration
    }

  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
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
      <span>${task.title}</span>
      <button onclick="deleteTask('${task._id}')">❌</button>
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
async function updateStatus(id, status) {
  try {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ status })
    });

     if (!res.ok) {
      const data = await res.json();
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

// Redirect if no project selected
if (path.endsWith("tasks.html") && !currentProjectId) {
  window.location.href = "projects.html";
}

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
        <button onclick="openProject('${project._id}')">
          Open Tasks
        </button>
      `;

      list.appendChild(li);
    });

  } catch (error) {
    console.error(error);
  }
}

//create project
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

// Open project tasks page
function openProject(projectId) {
  localStorage.setItem("projectId", projectId);
  window.location.href = "tasks.html";
}

// LOGOUT
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// AUTO LOAD TASKS (ONLY ON TASKS PAGE)
if (window.location.pathname.includes("tasks.html")) {
  getTasks();
}