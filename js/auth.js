let fName = document.getElementById("Fname");
let lName = document.getElementById("Lname");
let password = document.querySelector("#pass");
let conPassword = document.querySelector("#confirmPass");
let email = document.querySelector("#mail");
let submitBtn = document.querySelector("#submitBtn");

let fNameErr = document.querySelector(".fNameErr");
let lNameErr = document.querySelector(".lNameErr");
let passErr = document.querySelector(".passErr");
let conPassErr = document.querySelector(".ConPassErr");
let emailErr = document.querySelector(".emailErr");
let typeErr = document.querySelector(".typeErr");

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const showLogin = document.getElementById("showLogin");
const showRegister = document.getElementById("showRegister");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

//----rejex for validation-------------------
const nameRegex = /^[A-Za-z]{3,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const emailRegex = /^[a-zA-Z]{3,}[a-zA-Z0-9]*@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;

//--------toggle handling--------------------------
showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  registerForm.style.display = "block";
  loginForm.style.display = "none";
  showLogin.style.display = "inline";
  showRegister.style.display = "none";
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerForm.style.display = "none";
  loginForm.style.display = "block";
  showLogin.style.display = "none";
  showRegister.style.display = "inline";
});

//-------------------
//helper func
function validateField(value, regex) {
  return regex.test(value);
}
//Hide register errors on input
registerForm.addEventListener("input", function (e) {
  const target = e.target;

  if (target.tagName === "INPUT") {
    const errorSpan = target.closest(".input-group")?.querySelector(".error");

    if (errorSpan) {
      errorSpan.classList.remove("show");
    }
  }
});
//register validation
registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateField(fName.value.trim(), nameRegex)) {
    fNameErr.classList.add("show");
    return;
  }
  if (!validateField(lName.value.trim(), nameRegex)) {
    lNameErr.classList.add("show");
    return;
  }
  if (!validateField(email.value.trim(), emailRegex)) {
    emailErr.classList.add("show");
    return;
  }
  if (!validateField(password.value, passwordRegex)) {
    passErr.classList.add("show");
    return;
  }
  if (!(conPassword.value == password.value)) {
    conPassErr.classList.add("show");
    return;
  }
  let role = document.querySelector('input[name="role"]:checked');
  if (!role) {
    typeErr.classList.add("show");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const emailExists = users.some((u) => u.email === email.value.trim());

  if (emailExists) {
    emailErr.textContent = "Email already registered";
    emailErr.classList.add("show");
    return;
  }

  const newuser = {
    firstName: fName.value.trim(),
    lastName: lName.value.trim(),
    email: email.value.trim(),
    password: password.value,
    role: role.value,
    enrolledCourses: [],
    wishList: [],
  };

  users.push(newuser);
  localStorage.setItem("users", JSON.stringify(users));
  // mark user as logged in
  localStorage.setItem("loggedInUserEmail", newuser.email);
  registerForm.reset();

  if (newuser.role === "admin") window.location.href = "admin.html";
  else window.location.href = "student.html";
});

registerForm.addEventListener("change", function (e) {
  if (e.target.name === "role") {
    typeErr.classList.remove("show");
  }
});

// Hide login errors on input
document.getElementById("loginEmail").addEventListener("input", () => {
  document.querySelector(".loginEmailErr").classList.remove("show");
});
document.getElementById("loginPass").addEventListener("input", () => {
  document.querySelector(".loginPassErr").classList.remove("show");
});
//login validation
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPass").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    document.querySelector(".loginEmailErr").classList.add("show");
    document.querySelector(".loginPassErr").classList.add("show");
    return;
  }
  // save logged in user
  localStorage.setItem("loggedInUserEmail", user.email);

  //redirect based on role
  if (user.role === "admin") window.location.href = "admin.html";
  else window.location.href = "student.html";
});
