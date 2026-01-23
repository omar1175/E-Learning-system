// student.js: Student dashboard logic - wishlist, course progress, certificates
// =============================
// Student Dashboard JS
// =============================

document.addEventListener("DOMContentLoaded", () => {
  // Animate progress bars
  const progressFills = document.querySelectorAll(".progress-fill");

  progressFills.forEach((fill) => {
    const width = fill.style.width; // from HTML inline style (e.g., "50%")
    fill.style.width = "0%"; // start from 0
    setTimeout(() => {
      fill.style.width = width; // animate to actual width
    }, 300);
  });

  // Optional: Filter courses (example)
  const filterButtons = document.querySelectorAll(".filter-btn");
  const courses = document.querySelectorAll(".course-card");

  if (filterButtons.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        courses.forEach((course) => {
          if (filter === "all" || course.dataset.status === filter) {
            course.style.display = "block";
          } else {
            course.style.display = "none";
          }
        });

        // Highlight active button
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }
});
