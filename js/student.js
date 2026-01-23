// ================================
// Student Dashboard JS
// ================================

// Helper functions (reuse from enroll.js)
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function getLoggedInUser() {
  const email = localStorage.getItem("loggedInUserEmail");
  if (!email) return null;

  return getUsers().find((u) => u.email === email);
}

// DOM elements
const enrolledCoursesGrid = document.getElementById("enrolledCoursesGrid");
const welcomeMsg = document.querySelector(".welcome-msg");
const logoutBtn = document.getElementById("logoutBtn");

// Check login
const user = getLoggedInUser();

if (!user) {
  alert("Please login to access the dashboard.");
  window.location.href = "login.html";
}

// Display welcome
welcomeMsg.textContent = `Welcome, ${user.firstName}`;

// Logout logic
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInUserEmail");
  window.location.href = "login.html";
});

// Render enrolled courses
function renderEnrolledCourses() {
  enrolledCoursesGrid.innerHTML = "";

  if (!user.enrolledCourses.length) {
    enrolledCoursesGrid.innerHTML =
      "<p>You have not enrolled in any courses yet. <a href='courses.html'>Browse Courses</a></p>";
    return;
  }

  user.enrolledCourses.forEach((course) => {
    const courseCard = document.createElement("div");
    courseCard.classList.add("enrolled-course-card");

    courseCard.innerHTML = `
      <img src="${course.image}" alt="${course.title}">
      <div class="enrolled-course-card-content">
        <h3>${course.title}</h3>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: ${course.progress || 0}%"></div>
        </div>
          <a href="course-details.html?id=${course.id}" class="btn btn-primary">View Course</a>
      </div>
    `;

    enrolledCoursesGrid.appendChild(courseCard);
  });
}

// Initial render
renderEnrolledCourses();
