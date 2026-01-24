// student dashboard
document.addEventListener("DOMContentLoaded", () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const email = localStorage.getItem("loggedInUserEmail");
  const user = users.find((u) => u.email === email);

  if (!user) {
    alert("Please login first.");
    window.location.href = "auth.html";
  }

  const welcomeUser = document.getElementById("welcomeUser");
  if (welcomeUser) welcomeUser.textContent = `Hi, ${user.firstName}`;
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

  const profilePic = document.getElementById("profilePic");
  const profilePicInput = document.getElementById("profilePicInput");
  const editFirstName = document.getElementById("editFirstName");
  const editLastName = document.getElementById("editLastName");
  const editEmail = document.getElementById("editEmail");
  const editPassword = document.getElementById("editPassword");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const profileMsg = document.getElementById("profileMsg");

  editFirstName.value = user.firstName;
  editLastName.value = user.lastName;
  editEmail.value = user.email;

  if (user.profilePic) profilePic.src = user.profilePic;

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

    if (newEmail !== user.email) {
      const oldKey = `enrolledCourses_${user.email}`;
      const newKey = `enrolledCourses_${newEmail}`;
      const oldData = localStorage.getItem(oldKey);
      if (oldData) {
        localStorage.setItem(newKey, oldData);
        localStorage.removeItem(oldKey);
      }
    }

    user.firstName = newFirstName;
    user.lastName = newLastName;
    user.email = newEmail;
    if (newPassword) user.password = newPassword;

    localStorage.setItem("loggedInUserEmail", newEmail);

    const updatedUsers = users.map((u) => (u.email === user.email ? user : u));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    profileMsg.style.color = "green";
    profileMsg.textContent = "Profile updated successfully! ";

    if (welcomeUser) welcomeUser.textContent = `Hi, ${user.firstName}`;
  });

  //================= render enrolled courses ==========//
  const enrolledGrid = document.getElementById("enrolledCoursesGrid");
  function renderEnrolledCourses() {
    enrolledGrid.innerHTML = "";

    // 1. Get the specific user's enrollments
    const userEnrollmentsKey = `enrolledCourses_${user.email}`;
    const enrolledCourses =
      JSON.parse(localStorage.getItem(userEnrollmentsKey)) || [];

    // 2. Handle Empty State
    if (enrolledCourses.length === 0) {
      enrolledGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
            <p style="font-size: 1.2em; color: #666;">You haven't enrolled in any courses yet.</p>
            <a href="index.html" class="btn btn-primary" style="margin-top: 15px;">Browse Courses</a>
        </div>`;
      return;
    }

    // 3. Render Cards
    enrolledCourses.forEach((course) => {
      const card = document.createElement("div");
      card.className = "course-card";

      // Safe check for progress (default to 0 if missing)
      const progress = course.progress || 0;

      // Dynamic Button Text (Start vs Continue)
      const btnText =
        progress === 0 ? "▶ Start Course" : "⏯ Continue Learning";

      // Dynamic Button Class (Optional: Change color based on status)
      const btnStyle =
        progress === 0
          ? "background-color: #667eea;"
          : "background-color: #28a745;";

      // URL Encode the title for the link (handles spaces safely)
      const courseUrl = `playlist.html?id=${encodeURIComponent(course.id)}`;

      card.innerHTML = `
        <div style="position: relative;">
            <img src="${course.image}" alt="${course.title}" style="width: 100%; height: 180px; object-fit: cover;">
            <span style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">
                ${course.category || "Course"}
            </span>
        </div>
        <div class="course-card-content" style="padding: 20px;">
          <h3 style="margin-bottom: 10px;">${course.title}</h3>
          <p style="color: #666; font-size: 0.9em; margin-bottom: 15px;">Instructor: ${course.instructor || "Expert"}</p>
          
          <div style="background: #eee; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 15px;">
             <div style="width: ${progress}%; background: #28a745; height: 100%;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9em; margin-bottom: 15px;">
             <span>${progress}% Complete</span>
          </div>

          <a href="${courseUrl}" class="btn btn-primary" style="display: block; text-align: center; ${btnStyle}">
            ${btnText}
          </a>
        </div>
      `;
      enrolledGrid.appendChild(card);
    });
  }
  renderEnrolledCourses();

  //================ render wishList ======================//

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
