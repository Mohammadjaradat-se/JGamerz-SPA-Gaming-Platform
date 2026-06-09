import { saveUser } from "../utils/auth.js";
import { Navbar, initNavbar } from "../components/navbar.js";
import { showToast } from "../utils/toast.js";

const API = "http://localhost:3000";

export function AuthPage() {
  return `
    <div class="auth-container">

      <div class="auth-left">
        <h2 id="form-title">Welcome Back</h2>

        <div class="auth-toggle">
          <button id="loginBtn" class="active">Log In</button>
          <button id="signupBtn">Sign Up</button>
        </div>

        <form id="auth-form"></form>
      </div>

      <div class="auth-right">
        <img src="./assets/Logo.png" class="auth-logo">
        <h1>JGamerz</h1>
        <p>Join the ultimate gaming community</p>
      </div>

    </div>
  `;
}

export function initAuth() {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const form = document.getElementById("auth-form");
  const title = document.getElementById("form-title");

  // 👁️ Toggle Password
  function addPasswordToggle() {
    document.querySelectorAll(".toggle-password").forEach((icon) => {
      icon.onclick = () => {
        const input = icon.previousElementSibling;
        input.type = input.type === "password" ? "text" : "password";
      };
    });
  }

  // 🔹 LOGIN
  function renderLogin() {
    form.innerHTML = `
      <div class="input-group">
        <input type="text" id="login-identifier" placeholder="Email or Username" required />
      </div>

      <div class="input-group">
        <input type="password" id="login-password" placeholder="Password" required />
        <span class="toggle-password">Show</span>
      </div>

      <p class="error-msg" id="login-error"></p>

      <button type="submit">Log In</button>
    `;

    title.innerText = "Welcome Back";
    addPasswordToggle();

    // 🔥 مهم: إعادة ربط submit
    form.onsubmit = async (e) => {
      e.preventDefault();

      const idInput = document.getElementById("login-identifier");
      const passInput = document.getElementById("login-password");
      const error = document.getElementById("login-error");

      if (!idInput || !passInput) return;

      const id = idInput.value;
      const pass = passInput.value;

      if (!id || !pass) {
        error.innerText = "Please fill all fields";
        return;
      }

      error.innerText = "";

      try {
        const res = await fetch(`${API}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: id,
            password: pass,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          error.innerText = data.message || "Login failed";
          return;
        }

        saveUser(data);

        showToast("Login Success 🔥");

        const nav = document.getElementById("navbar");

        nav.innerHTML = Navbar();
        initNavbar();

        const redirectPage = localStorage.getItem("redirectPage");

        if (redirectPage) {
          navigate(redirectPage);
          localStorage.removeItem("redirectPage");
        } else {
          navigate("home");
        }

      } catch (err) {
        error.innerText = "Server not reachable";
        console.log(err);
      }
    };
  }

  // 🔹 SIGNUP
  function renderSignup() {
    form.innerHTML = `
      <div class="input-group">
        <input type="email" id="email" placeholder="Enter Email" required />
      </div>

      <div class="input-group">
        <input type="text" id="username" placeholder="Username" required />
      </div>

      <div class="input-group">
        <input type="password" id="password" placeholder="Password" required />
        <span class="toggle-password">Show</span>
      </div>

      <div class="input-group">
        <input type="password" id="confirmPassword" placeholder="Confirm Password" required />
        <span class="toggle-password">Show</span>
      </div>

      <p class="error-msg" id="error"></p>

      <button type="submit">Create Account</button>
    `;

    title.innerText = "Create Account";
    addPasswordToggle();

    // 🔥 مهم: إعادة ربط submit
    form.onsubmit = async (e) => {
      e.preventDefault();

      const emailInput = document.getElementById("email");
      const userInput = document.getElementById("username");
      const passInput = document.getElementById("password");
      const confirmInput = document.getElementById("confirmPassword");
      const error = document.getElementById("error");

      if (!emailInput || !userInput || !passInput || !confirmInput) return;

      const email = emailInput.value;
      const user = userInput.value;
      const pass = passInput.value;
      const confirm = confirmInput.value;

      if (!email || !user || !pass || !confirm) {
        error.innerText = "Please fill all fields";
        return;
      }

      if (pass !== confirm) {
        error.innerText = "Passwords do not match";
        return;
      }

      error.innerText = "";

      try {
        const res = await fetch(`${API}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            username: user,
            password: pass,
            confirmPassword: confirm,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          error.innerText = data.message || "Signup failed";
          return;
        }

        saveUser(data);

        showToast("Account Created 🔥");

        const nav = document.getElementById("navbar");

        nav.innerHTML = Navbar();
        initNavbar();

        const redirectPage = localStorage.getItem("redirectPage");

        if (redirectPage) {
          navigate(redirectPage);
          localStorage.removeItem("redirectPage");
        } else {
          navigate("home");
        }

      } catch (err) {
        error.innerText = "Server not reachable";
        console.log(err);
      }
    };
  }

  // INIT
  renderLogin();

  loginBtn.onclick = () => {
    renderLogin();
    loginBtn.classList.add("active");
    signupBtn.classList.remove("active");
  };

  signupBtn.onclick = () => {
    renderSignup();
    signupBtn.classList.add("active");
    loginBtn.classList.remove("active");
  };
}
