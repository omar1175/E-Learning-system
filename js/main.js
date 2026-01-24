function sendData(courseId) {
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
  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  const course = courses.find((c) => c.id == courseId);

  if (!course) {
    alert("Course not found.");
    return;
  }
  const exists = user.wishList.some((c) => c.id == course.id);
  if (exists) {
    alert(`"${course.title}" is already in your wishlist.`);
    return;
  }
  if (role === "student") {
    user.wishList.push({
      id: course.id,
      title: course.title,
      image: course.image,
    });
  } else {
    alert(`must be student to add to wishlist! `);
    return;
  }

  const updatedUsers = users.map((u) => (u.email === email ? user : u));
  localStorage.setItem("users", JSON.stringify(updatedUsers));

  alert(`"${course.title}" added to your wishlist!`);
}

// navbar update based on login
const role = localStorage.getItem("userRole");

document.addEventListener("DOMContentLoaded", () => {
  const loggedInEmail = localStorage.getItem("loggedInUserEmail");
  const authLinks = document.getElementById("authLinks");

  if (loggedInEmail && authLinks) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === loggedInEmail);
    if (role === "student") {
      authLinks.innerHTML = `
      <span class="welcome-msg">Hi, ${user.firstName}</span>
      <a href="student.html" class="btn btn-outline">Dashboard</a>
      <button id="logoutBtnNav" class="btn btn-outline">Logout</button>
    `;
    } else {
      authLinks.innerHTML = `
      <span class="welcome-msg">Hi, ${user.firstName}</span>
      <a href="admin.html" class="btn btn-outline">Dashboard</a>
      <button id="logoutBtnNav" class="btn btn-outline">Logout</button>
    `;
    }
    document.getElementById("logoutBtnNav").addEventListener("click", () => {
      localStorage.removeItem("loggedInUserEmail");
      window.location.href = "index.html";
    });
  }
  const getStartedBtn = document.querySelector(
    ".btn.btn-primary[href='auth.html']",
  );
  if (loggedInEmail && getStartedBtn) {
    getStartedBtn.style.display = "none";
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
