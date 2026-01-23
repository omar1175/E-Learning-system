document.addEventListener("DOMContentLoaded", () => {
  const hero = document.getElementById("courseHero");
  const content = document.getElementById("courseContent");

  // 1️⃣ Get course ID from URL
  const params = new URLSearchParams(window.location.search);
  const courseId = Number(params.get("id"));

  // 2️⃣ Get courses from localStorage
  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    hero.innerHTML = "<p>Course not found.</p>";
    return;
  }

  // 3️⃣ Render Hero Section
  hero.innerHTML = `
    <h1>${course.title}</h1>
    <p>${course.description}</p>
  `;

  // 4️⃣ Create Enroll Button dynamically
  const enrollBtn = document.createElement("a");
  enrollBtn.className = "btn btn-primary enroll-btn";
  enrollBtn.href = "#";
  enrollBtn.dataset.id = course.id;
  enrollBtn.dataset.title = course.title;
  enrollBtn.dataset.image = course.image;
  enrollBtn.textContent = "Enroll Now";

  hero.appendChild(enrollBtn);

  // 5️⃣ Render Course Tabs: Overview / Syllabus / Reviews
  content.innerHTML = `
    <div class="course-tabs">
      <button class="tab-btn active" data-tab="overview">Overview</button>
      <button class="tab-btn" data-tab="syllabus">Syllabus</button>
      <button class="tab-btn" data-tab="reviews">Reviews</button>
    </div>

    <div class="tab-content active" id="overview">
      <h2>Course Overview</h2>
      <p>${course.description}</p>
      <div class="instructor">
        <img src="${course.instructorImage}" alt="${course.instructor}" />
        <div>
          <h3>Instructor: ${course.instructor}</h3>
          <p>${course.instructorBio}</p>
        </div>
      </div>
    </div>

    <div class="tab-content" id="syllabus">
      <h2>Course Lessons</h2>
      <ul>
        ${course.lessons
          .map(
            (lesson) => `
          <li>
            <strong>${lesson.title}</strong>
            <p>${lesson.content}</p>
          </li>
        `,
          )
          .join("")}
      </ul>
    </div>

    <div class="tab-content" id="reviews">
      <h2>Student Reviews</h2>
      ${
        course.reviews && course.reviews.length > 0
          ? course.reviews
              .map(
                (r) =>
                  `<div class="review"><strong>${r.name}:</strong> ${r.comment}</div>`,
              )
              .join("")
          : "<p>No reviews yet.</p>"
      }
    </div>
  `;

  // 6️⃣ Tab functionality
  const tabs = content.querySelectorAll(".tab-btn");
  const tabContents = content.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((tc) => tc.classList.remove("active"));

      tab.classList.add("active");
      const target = content.querySelector(`#${tab.dataset.tab}`);
      console.log(tab.dataset);
      target.classList.add("active");
    });
  });

  // 7️⃣ Enroll button logic (reuse enroll.js function)
  enrollBtn.addEventListener("click", (e) => {
    e.preventDefault();
    enrollCourse(course);
  });
});

// 8️⃣ Enroll function
function enrollCourse(course) {
  let enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];

  if (enrolled.some((c) => c.id === course.id)) {
    alert(`You are already enrolled in "${course.title}"`);
    return;
  }

  enrolled.push({ id: course.id, title: course.title, image: course.image });
  localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));
  alert(`Successfully enrolled in "${course.title}"`);
}
