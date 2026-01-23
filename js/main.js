function sendData(courseId) {
  // 1️⃣ Get logged-in user
  const email = localStorage.getItem("loggedInUserEmail");
  if (!email) {
    alert("Please login first to add courses to your wishlist.");
    window.location.href = "auth.html";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email);

  if (!user) {
    alert("User not found. Please login again.");
    localStorage.removeItem("loggedInUserEmail");
    window.location.href = "auth.html";
    return;
  }

  // 2️⃣ Get the course from localStorage courses array
  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  const course = courses.find((c) => c.id == courseId);

  if (!course) {
    alert("Course not found.");
    return;
  }

  // 3️⃣ Check if already in wishlist
  const exists = user.wishList.some((c) => c.id == course.id);
  if (exists) {
    alert(`"${course.title}" is already in your wishlist.`);
    return;
  }

  // 4️⃣ Add to wishlist
  user.wishList.push({
    id: course.id,
    title: course.title,
    image: course.image,
  });

  // 5️⃣ Save back to localStorage
  const updatedUsers = users.map((u) => (u.email === email ? user : u));
  localStorage.setItem("users", JSON.stringify(updatedUsers));

  alert(`"${course.title}" added to your wishlist!`);
}

// ==============================
// Navbar update based on login
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const loggedInEmail = localStorage.getItem("loggedInUserEmail");
  const authLinks = document.getElementById("authLinks");

  if (loggedInEmail && authLinks) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === loggedInEmail);

    // Replace Login/SignUp with Dashboard and Welcome message
    authLinks.innerHTML = `
      <span class="welcome-msg">Hi, ${user.firstName}</span>
      <a href="student.html" class="btn btn-outline">Dashboard</a>
      <button id="logoutBtnNav" class="btn btn-outline">Logout</button>
    `;

    // Handle logout
    document.getElementById("logoutBtnNav").addEventListener("click", () => {
      localStorage.removeItem("loggedInUserEmail");
      window.location.href = "index.html";
    });
  }
  const getStartedBtn = document.querySelector(
    ".btn.btn-primary[href='auth.html']",
  );
  if (loggedInEmail && getStartedBtn) {
    getStartedBtn.style.display = "none"; // Hide it when logged in
  }

  /////////////////////////////////
  const navLinks = document.querySelectorAll(".nav-links a");
  const currentPage = window.location.pathname.split("/").pop();

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop();

    if (
      linkPage === currentPage ||
      (linkPage === "index.html" && currentPage === "")
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});
