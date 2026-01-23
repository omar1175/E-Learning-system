document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("coursesGrid");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  const email = localStorage.getItem("loggedInUserEmail");
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email);

  function renderCourses(list) {
    grid.innerHTML = "";
    if (list.length === 0) {
      grid.innerHTML = "<p>No courses found.</p>";
      return;
    }

    list.forEach((course) => {
      const card = document.createElement("div");
      card.className = "course-card";

      card.innerHTML = `
        <img src="${course.image}" alt="${course.title}">
        <div class="course-card-content">
          <h3>${course.title}</h3>
          <p>${course.description}</p>
          <a href="course-details.html?id=${course.id}" class="btn btn-primary">View Course</a>
          <button class="btn btn-outline wishlist-btn">Add to Wishlist</button>
        </div>
      `;

      // Handle wishlist button
      const wishlistBtn = card.querySelector(".wishlist-btn");

      if (user && user.wishList.some((c) => c.id === course.id)) {
        wishlistBtn.disabled = true;
        wishlistBtn.textContent = "In Wishlist";
      }

      wishlistBtn.addEventListener("click", () => {
        sendData(course.id); // sendData from main.js
        wishlistBtn.disabled = true;
        wishlistBtn.textContent = "In Wishlist";
      });

      grid.appendChild(card);
    });
  }

  renderCourses(courses);

  function filterCourses() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = courses.filter((course) => {
      const matchesTitle = course.title.toLowerCase().includes(searchText);
      const matchesCategory =
        selectedCategory === "" || course.category === selectedCategory;
      return matchesTitle && matchesCategory;
    });

    renderCourses(filtered);
  }

  if (searchInput) searchInput.addEventListener("input", filterCourses);
  if (categoryFilter) categoryFilter.addEventListener("change", filterCourses);
});
