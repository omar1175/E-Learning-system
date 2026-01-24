document.addEventListener("DOMContentLoaded", () => {
  const wishlistGrid = document.getElementById("wishlistGrid");
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

  const welcomeSpan = document.getElementById("welcomeUser");
  if (welcomeSpan) welcomeSpan.textContent = `Hi, ${user.firstName}`;
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
});
