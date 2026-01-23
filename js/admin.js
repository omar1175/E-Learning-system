// admin.js: Admin dashboard logic - manage students, approve/reject enrollments
const studentsTableBody = document.getElementById("studentsTableBody");
// dashboard counters
const USERS_KEY = "users";

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

document.addEventListener("DOMContentLoaded", () => {
  const totalCoursesEl = document.getElementById("totalCourses");
  const totalStudentsEl = document.getElementById("totalStudents");

  function updateDashboardCounters() {
    const courses = getCourses();
    const students = getUsers().filter((u) => u.role === "student");

    totalCoursesEl.textContent = `${courses.length} Course${courses.length !== 1 ? "s" : ""}`;

    totalStudentsEl.textContent = `${students.length} Student${students.length !== 1 ? "s" : ""}`;
  }

  updateDashboardCounters();
});

//track student progress

function renderStudentsProgress() {
  const students = getUsers().filter((u) => u.role === "student");

  studentsTableBody.innerHTML = "";

  students.forEach((student) => {
    let coursesHTML = "No courses";

    if (student.enrolledCourses && student.enrolledCourses.length > 0) {
      coursesHTML = student.enrolledCourses
        .map((course) => {
          return `
          <div style="margin-bottom:8px">
            <strong>${course.title}</strong><br>
            Progress: ${course.progress}% 
            ${course.progress === 100 ? "✅ Completed" : "⏳ In progress"}
          </div>
        `;
        })
        .join("");
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${student.firstName} ${student.lastName}</td>
      <td>${student.email}</td>
      <td>${coursesHTML}</td>
    `;

    studentsTableBody.appendChild(tr);
  });
}

renderStudentsProgress();
