// ==============================
// Student Dashboard Logic
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  // Get users and logged in user
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const email = localStorage.getItem("loggedInUserEmail");
  const user = users.find((u) => u.email === email);

  if (!user) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  // -------------------------
  // Welcome message
  // -------------------------
  const welcomeUser = document.getElementById("welcomeUser");
  if (welcomeUser) welcomeUser.textContent = `Hi, ${user.firstName}`;

  // -------------------------
  // Sidebar tab switching
  // -------------------------
  const sidebarBtns = document.querySelectorAll(".sidebar-btn");
  const tabs = document.querySelectorAll(".tab-content");

  sidebarBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      sidebarBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const tabId = btn.dataset.tab;
      tabs.forEach((t) => t.classList.remove("active"));
      document.getElementById(tabId).classList.add("active");
    });
  });

  // -------------------------
  // Profile Section
  // -------------------------
  const profilePic = document.getElementById("profilePic");
  const profilePicInput = document.getElementById("profilePicInput");
  const editFirstName = document.getElementById("editFirstName");
  const editLastName = document.getElementById("editLastName");
  const editEmail = document.getElementById("editEmail");
  const editPassword = document.getElementById("editPassword");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const profileMsg = document.getElementById("profileMsg");

  // Load profile data
  editFirstName.value = user.firstName;
  editLastName.value = user.lastName;
  editEmail.value = user.email;

  if (user.profilePic) profilePic.src = user.profilePic;

  // Upload profile picture
  profilePicInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      profilePic.src = reader.result;
      user.profilePic = reader.result;

      const updatedUsers = users.map((u) =>
        u.email === user.email ? user : u,
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    };
    reader.readAsDataURL(file);
  });

  // Save profile changes
  saveProfileBtn.addEventListener("click", () => {
    const newFirstName = editFirstName.value.trim();
    const newLastName = editLastName.value.trim();
    const newEmail = editEmail.value.trim();
    const newPassword = editPassword.value;

    if (!newFirstName || !newLastName || !newEmail) {
      profileMsg.style.color = "red";
      profileMsg.textContent = "First name, last name, and email are required.";
      return;
    }

    const emailTaken = users.some(
      (u) => u.email === newEmail && u.email !== user.email,
    );
    if (emailTaken) {
      profileMsg.style.color = "red";
      profileMsg.textContent = "This email is already used by another account.";
      return;
    }

    user.firstName = newFirstName;
    user.lastName = newLastName;
    user.email = newEmail;
    if (newPassword) user.password = newPassword;

    localStorage.setItem("loggedInUserEmail", newEmail);

    const updatedUsers = users.map((u) => (u.email === user.email ? user : u));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    profileMsg.style.color = "green";
    profileMsg.textContent = "Profile updated successfully! ✅";

    if (welcomeUser) welcomeUser.textContent = `Hi, ${user.firstName}`;
  });

  // -------------------------
  // Render Enrolled Courses
  // -------------------------
  const enrolledGrid = document.getElementById("enrolledCoursesGrid");

  function renderEnrolledCourses() {
    enrolledGrid.innerHTML = "";
    if (!user.enrolledCourses || user.enrolledCourses.length === 0) {
      enrolledGrid.innerHTML =
        "<p>You haven't enrolled in any courses yet.</p>";
      return;
    }

    user.enrolledCourses.forEach((course) => {
      const card = document.createElement("div");
      card.className = "course-card";
      card.innerHTML = `
        <img src="${course.image}" alt="${course.title}">
        <div class="course-card-content">
          <h3>${course.title}</h3>
          <p>${course.description || ""}</p>
          <a href="course-details.html?id=${course.id}" class="btn btn-primary">View Course</a>
        </div>
      `;
      enrolledGrid.appendChild(card);
    });
  }

  renderEnrolledCourses();

  // -------------------------
  // Render Wishlist
  // -------------------------
  const wishlistGrid = document.getElementById("wishlistGrid");

  function renderWishlist() {
    wishlistGrid.innerHTML = "";
    if (!user.wishList || user.wishList.length === 0) {
      wishlistGrid.innerHTML = "<p>Your wishlist is empty.</p>";
      return;
    }

    user.wishList.forEach((course) => {
      const card = document.createElement("div");
      card.className = "course-card";
      card.innerHTML = `
        <img src="${course.image}" alt="${course.title}">
        <div class="course-card-content">
          <h3>${course.title}</h3>
          <p>${course.description || ""}</p>
          <a href="course-details.html?id=${course.id}" class="btn btn-primary">View Course</a>
          <button class="btn btn-outline remove-btn">Remove</button>
        </div>
      `;
      const removeBtn = card.querySelector(".remove-btn");
      removeBtn.addEventListener("click", () => {
        user.wishList = user.wishList.filter((c) => c.id !== course.id);
        const updatedUsers = users.map((u) =>
          u.email === user.email ? user : u,
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        renderWishlist();
      });

      wishlistGrid.appendChild(card);
    });
  }

  renderWishlist();

  // -------------------------
  // Logout
  // -------------------------
  const logoutBtns = [
    document.getElementById("logoutBtn"),
    document.getElementById("logoutSidebarBtn"),
  ];
  logoutBtns.forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      localStorage.removeItem("loggedInUserEmail");
      window.location.href = "auth.html";
    });
  });
});
