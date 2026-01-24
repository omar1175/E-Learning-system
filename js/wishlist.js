document.addEventListener("DOMContentLoaded", () => {
  const wishlistGrid = document.getElementById("wishlistGrid");

  // 1️⃣ Get logged-in user
  const email = localStorage.getItem("loggedInUserEmail");
  if (!email) {
    alert("Please login first to view your wishlist.");
    window.location.href = "login.html";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email);

  if (!user) {
    alert("User not found. Please login again.");
    localStorage.removeItem("loggedInUserEmail");
    window.location.href = "login.html";
    return;
  }

  // Display welcome
  const welcomeSpan = document.getElementById("welcomeUser");
  if (welcomeSpan) welcomeSpan.textContent = `Hi, ${user.firstName}`;

  // 2️⃣ Render wishlist
  function renderWishlist() {
    wishlistGrid.innerHTML = "";

    if (user.wishList.length === 0) {
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
          <a href="course-details.html?id=${course.id}" class="btn btn-primary">View Course</a>
          <button class="btn btn-outline remove-btn">Remove</button>
        </div>
      `;

      // Remove button logic
      const removeBtn = card.querySelector(".remove-btn");
      removeBtn.addEventListener("click", () => {
        // Remove course from user.wishList
        user.wishList = user.wishList.filter((c) => c.id !== course.id);

        // Save updated users array
        const updatedUsers = users.map((u) =>
          u.email === user.email ? user : u,
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        // Re-render wishlist
        renderWishlist();
      });

      wishlistGrid.appendChild(card);
    });
  }

  renderWishlist();
});
