document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("coursesGrid");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  let courses = JSON.parse(localStorage.getItem("courses")) || [];

  // Optional: add category to courses for filtering
  // courses.forEach(c => c.category = c.category || "programming");

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
          <button id="wish" class=".wishlist-btn" onclick="sendData(${course.id})">Add to Wishlist</button>
          </div>
      `;
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

  searchInput.addEventListener("input", filterCourses);
  categoryFilter.addEventListener("change", filterCourses);
});
send;
