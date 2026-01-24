document.addEventListener("DOMContentLoaded", () => {
  const hero = document.getElementById("courseHero");
  const content = document.getElementById("courseContent");

  // 1️⃣ Get course ID from URL
  const params = new URLSearchParams(window.location.search);
  const courseId = Number(params.get("id"));

  if (!courseId) {
    hero.innerHTML = `
      <div style="text-align: center;">
        <h1>Course Not Found</h1>
        <p>We couldn't find the course you're looking for.</p>
        <a href="index.html" class="btn btn-primary" style="margin-top: 20px;">Browse All Courses</a>
      </div>
    `;
    return;
  }

  // 2️⃣ Get Data (Unified DB -> Fallback)
  let course;
  let unifiedData = JSON.parse(localStorage.getItem("eLearningData"));

  // Try finding in Unified DB first
  if (unifiedData && unifiedData.courses) {
    course = unifiedData.courses.find((c) => c.id === courseId);
  }

  // Fallback to legacy 'courses' array
  if (!course) {
    const legacyCourses = JSON.parse(localStorage.getItem("courses")) || [];
    course = legacyCourses.find((c) => c.id === courseId);
  }

  if (!course) {
    hero.innerHTML = "<h1>404</h1><p>Course data is missing.</p>";
    return;
  }

  // 3️⃣ Render Hero Base
  hero.innerHTML = `
    <h1>${course.title}</h1>
    <p>${course.description}</p>
    <div id="heroActionContainer"></div>
  `;

  // 4️⃣ USER & ENROLLMENT CHECK
  const heroActionContainer = document.getElementById("heroActionContainer");

  // ✅ CHECK 1: Who is the active user?
  const userEmail = localStorage.getItem("loggedInUserEmail");

  // ✅ CHECK 2: Get enrollments SPECIFIC to this user
  let isEnrolled = false;
  let userEnrollmentsKey = "";

  if (userEmail) {
    // This key must match what student.js reads!
    userEnrollmentsKey = `enrolledCourses_${userEmail}`;

    const userEnrollments =
      JSON.parse(localStorage.getItem(userEnrollmentsKey)) || [];
    isEnrolled = userEnrollments.some((c) => c.id === courseId);
  }

  // --- BUTTON CREATION LOGIC ---

  // A. Create "Start Learning" Button (For Enrolled Users)
  function createStartButton() {
    const btn = document.createElement("a");
    btn.className = "btn btn-primary";
    btn.textContent = "▶ Start Learning";
    btn.href = `playlist.html?id=${course.id}`; // Pass ID to player
    btn.style.backgroundColor = "#28a745"; // Green

    btn.addEventListener("click", () => {
      // Sync 'activeCourseId' for the player
      if (unifiedData) {
        unifiedData.activeCourseId = course.id;
        localStorage.setItem("eLearningData", JSON.stringify(unifiedData));
      }
    });
    return btn;
  }

  // B. Create "Enroll Now" Button (For Logged-in but New Users)
  function createEnrollButton() {
    const btn = document.createElement("a");
    btn.className = "btn btn-primary";
    btn.textContent = "Enroll Now";
    btn.href = "#";

    btn.addEventListener("click", (e) => {
      e.preventDefault();

      // Safety Check: Double check login status
      const currentEmail = localStorage.getItem("loggedInUserEmail");
      if (!currentEmail) {
        alert("Please login to enroll in courses.");
        window.location.href = "auth.html"; // Redirect to login
        return;
      }

      // 1. Get current list for THIS user
      const key = `enrolledCourses_${currentEmail}`;
      const currentEnrolled = JSON.parse(localStorage.getItem(key)) || [];

      // 2. Add Course to Dashboard
      if (!currentEnrolled.some((c) => c.id === course.id)) {
        // ✨ THIS OBJECT IS WHAT APPEARS IN THE DASHBOARD
        currentEnrolled.push({
          id: course.id,
          title: course.title,
          image: course.image || "https://via.placeholder.com/150",
          instructor: course.instructor || "Expert Instructor",
          category: course.category || "General",
          progress: 0, // Initialize progress at 0%
          dateEnrolled: new Date().toISOString(),
        });

        // Save back to LocalStorage
        localStorage.setItem(key, JSON.stringify(currentEnrolled));

        // 3. Success Feedback
        alert(
          `🎉 Success! You have enrolled in ${course.title}. Check your Student Dashboard.`,
        );

        // 4. Instant UI Update
        heroActionContainer.innerHTML = "";
        heroActionContainer.appendChild(createStartButton());
      } else {
        alert("You are already enrolled!");
      }
    });
    return btn;
  }

  // C. Create "Login to Enroll" Button (For Guests)
  function createLoginButton() {
    const btn = document.createElement("a");
    btn.className = "btn btn-primary";
    btn.textContent = "Login to Enroll";
    btn.href = "auth.html"; // Redirect to your login page
    return btn;
  }

  // --- DECIDE WHICH BUTTON TO SHOW ---
  if (!userEmail) {
    // Case 1: Guest (Not logged in)
    heroActionContainer.appendChild(createLoginButton());
  } else if (isEnrolled) {
    // Case 2: User is logged in AND has this course
    heroActionContainer.appendChild(createStartButton());
  } else {
    // Case 3: User is logged in but NOT enrolled
    heroActionContainer.appendChild(createEnrollButton());
  }

  // 5️⃣ Render Content Tabs (Overview, Syllabus, Reviews)
  content.innerHTML = `
    <div class="course-tabs">
      <button class="tab-btn active" data-tab="overview">Overview</button>
      <button class="tab-btn" data-tab="syllabus">Syllabus</button>
      <button class="tab-btn" data-tab="reviews">Reviews</button>
    </div>

    <div class="tab-content active" id="overview">
      <h2>Course Overview</h2>
      <p style="line-height: 1.8; color: #555;">${course.description}</p>
      
      <div class="instructor">
        <img src="${course.image || "https://via.placeholder.com/100"}" alt="${course.instructor || "Instructor"}" />
        <div>
          <h3 style="margin: 0 0 5px 0;">Instructor: ${course.instructor || "Expert Instructor"}</h3>
          <p style="margin: 0; font-size: 0.9em; color: #666;">${course.instructorBio || "Professional developer with years of experience."}</p>
        </div>
      </div>
    </div>

    <div class="tab-content" id="syllabus">
      <h2 style="margin-bottom: 20px;">Course Curriculum</h2>
      <ul>
        ${
          (course.videos || course.lessons || []).length > 0
            ? (course.videos || course.lessons)
                .map(
                  (item, index) => `
          <li>
            <div style="display: flex; align-items: center;">
                <span style="background: #eee; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; color: #555;">${index + 1}</span>
                <div>
                    <strong>${item.title}</strong>
                    <div style="font-size: 0.85em; color: #888;">${item.content || item.duration || "Video Lesson"}</div>
                </div>
            </div>
            ${item.duration ? `<span style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">${item.duration}</span>` : ""}
          </li>
        `,
                )
                .join("")
            : "<li style='text-align:center;'>No lessons available for this course yet.</li>"
        }
      </ul>
    </div>

    <div class="tab-content" id="reviews">
      <h2 style="margin-bottom: 20px;">Student Feedback</h2>
      ${
        course.reviews && course.reviews.length > 0
          ? course.reviews
              .map(
                (r) => `
            <div class="review">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <strong>${r.name}</strong>
                    <span style="color: #f1c40f;">★★★★★</span>
                </div>
                <div style="color: #555;">${r.comment}</div>
            </div>`,
              )
              .join("")
          : "<div style='text-align: center; color: #888; padding: 30px;'>No reviews yet. Be the first to review!</div>"
      }
    </div>
  `;

  // 6️⃣ Tab Switching Logic
  const tabs = content.querySelectorAll(".tab-btn");
  const tabContents = content.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((tc) => tc.classList.remove("active"));
      tab.classList.add("active");
      const target = content.querySelector(`#${tab.dataset.tab}`);
      if (target) target.classList.add("active");
    });
  });
});
