let token = localStorage.getItem("token");

const path = window.location.pathname;

// Clean invalid tokens
if (token === "undefined" || token === "null") {
  localStorage.removeItem("token");
  token = null;
}

// If NOT logged in → block tasks page
if (path.endsWith("tasks.html") && !token) {
  window.location.replace("index.html");
}

// If logged in → block login page
if ((path.endsWith("index.html") || path.endsWith("register.html")) && token) {
  window.location.replace("tasks.html");
}

// ======== AUTH FORM TOGGLE ========
let isLogin = true; // true = login, false = register

function toggleForm() {
  isLogin = !isLogin;

  const formTitle = document.getElementById("form-title");
  const submitBtn = document.getElementById("submit-btn");
  const toggleText = document.getElementById("toggle-text");
  const nameGroup = document.getElementById("name-group");

  if (!formTitle || !submitBtn || !toggleText) return;

  formTitle.innerText = isLogin ? "Login" : "Register";
  submitBtn.innerText = isLogin ? "Login" : "Register";
  toggleText.innerText = isLogin ? "Don't have an account?" : "Already have an account?";

  //show name for registration
  nameGroup.style.display = isLogin ? "none" : "block";
}

// ======== HANDLE LOGIN OR REGISTER ========
async function handleSubmit() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    alert("Email and password are required");
    return;
  }

  const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

  // Send name only if registering
  const body = isLogin
    ? { email, password }
    : { name: document.getElementById("name")?.value, email, password };

  if (!isLogin && !body.name) {
    alert("Name is required for registration");
    return;
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
      window.location.href = "tasks.html";
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

// LOGIN FUNCTION
/*async function login() {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.token) {
      alert(data.message || "Login failed");
      return;
    }

    token = data.token;
    localStorage.setItem("token", token);

    // Redirect to tasks page
    window.location.href = "tasks.html";

  } catch (error) {
    console.error(error);
    alert("Error logging in");
  }
}*/

// GET TASKS
async function getTasks() {
  try {
    const res = await fetch("http://localhost:5000/api/tasks", {
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
  <span>
    <strong>${task.title}</strong> 
    <small style="color: ${task.status === "done" ? "green" :
          task.status === "in-progress" ? "orange" :
            task.status === "awaiting" ? "purple" :
              "gray"
        }">
      (${task.status})
    </small>
  </span>

  <div>
    <select onchange="updateStatus('${task._id}', this.value)">
      <option value="pending" ${task.status === "pending" ? "selected" : ""}>pending</option>
      <option value="in-progress" ${task.status === "in-progress" ? "selected" : ""}>in-progress</option>
      <option value="awaiting" ${task.status === "awaiting" ? "selected" : ""}>awaiting</option>
      <option value="done" ${task.status === "done" ? "selected" : ""}>done</option>
    </select>

    <button onclick="deleteTask('${task._id}')">❌</button>
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
    const titleInput = document.getElementById("taskTitle");
    if (!titleInput) return;

    const title = titleInput.value;

    if (!title) {
      alert("Task title is required");
      return;
    }

    await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ title })
    });

    titleInput.value = "";
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

// LOGOUT
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// AUTO LOAD TASKS (ONLY ON TASKS PAGE)
if (window.location.pathname.includes("tasks.html")) {
  getTasks();
}