// =============================
// ENROLLMENT LOGIC - FINAL BOSS
// =============================

// --- Helper functions ---
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getLoggedInUser() {
  const email = localStorage.getItem("loggedInUserEmail");
  if (!email) return null;

  return getUsers().find((user) => user.email === email);
}

// --- Core enrollment function ---
function enrollCourse(course) {
  const user = getLoggedInUser();

  // 1️⃣ Not logged in
  if (!user) {
    alert("Please login first to enroll in this course.");
    window.location.href = "auth.html";
    return;
  }

  // 2️⃣ Prevent duplicate enrollment
  const alreadyEnrolled = user.enrolledCourses.some((c) => c.id === course.id);
  if (alreadyEnrolled) {
    alert(`You are already enrolled in "${course.title}"!`);
    return;
  }

  // 3️⃣ Add course to user's enrolledCourses
  user.enrolledCourses.push({
    id: course.id,
    title: course.title,
    image: course.image,
    progress: 0,
    enrolledAt: new Date().toISOString(),
  });

  // 4️⃣ Save back to localStorage
  const users = getUsers().map((u) => (u.email === user.email ? user : u));
  saveUsers(users);

  alert(`Successfully enrolled in "${course.title}" 🎉`);
  window.location.href = "student.html"; // Redirect to student dashboard
}

// --- Automatic button hookup ---
document.addEventListener("DOMContentLoaded", () => {
  const enrollButtons = document.querySelectorAll(".enroll-btn");

  if (!enrollButtons.length) return;

  enrollButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      // Get course info from data attributes
      const course = {
        id: Number(btn.dataset.id),
        title: btn.dataset.title,
        image: btn.dataset.image,
      };

      enrollCourse(course); // Call the core function
    });
  });
});
