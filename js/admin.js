const studentsTableBody = document.getElementById("studentsTableBody");
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
