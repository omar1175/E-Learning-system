// Global State
const state = {
  courseData: null,
  completedVideos: [],
  currentVideoIndex: 0,
  certificate: null,
};

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  loadCourseData();
});

//helper function

function convertToEmbedUrl(url) {
  if (!url) return "";

  // Case 1: Already an embed link
  if (url.includes("/embed/")) return url;

  // Case 2: Short URL (youtu.be/ID)
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  // Case 3: Standard URL (youtube.com/watch?v=ID)
  if (url.includes("v=")) {
    const id = url.split("v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  return url; // Return original if pattern doesn't match
}

// Load Course Data
function loadCourseData() {
  // 1. Get Course ID from URL
  const params = new URLSearchParams(window.location.search);
  const courseId = Number(params.get("id"));

  if (!courseId) {
    showEmptyState("No course ID provided in URL.");
    return;
  }

  // 2. Fetch 'courses' from LocalStorage
  const allCourses = JSON.parse(localStorage.getItem("courses")) || [];
  const foundCourse = allCourses.find((c) => c.id === courseId);

  if (!foundCourse) {
    showEmptyState("Course not found in database.");
    return;
  }

  // 3. Adapt Data for Player
  // We map your 'lessons' array to the 'videos' format the player uses
  const playerVideos = (foundCourse.lessons || []).map((lesson) => ({
    title: lesson.title,
    url: convertToEmbedUrl(lesson.video), // <--- THIS FIXED THE ERROR    duration: lesson.duration || "10:00",
    description: lesson.description || "",
  }));

  // 4. Update State
  state.courseData = {
    id: foundCourse.id,
    title: foundCourse.title,
    description: foundCourse.description,
    videos: playerVideos,
  };

  // 5. Load Logged-In User's Progress
  const userEmail = localStorage.getItem("loggedInUserEmail");
  if (userEmail) {
    const key = `enrolledCourses_${userEmail}`;
    const enrolledCourses = JSON.parse(localStorage.getItem(key)) || [];

    // Find this specific course in the user's enrollments
    const userCourseData = enrolledCourses.find((c) => c.id === courseId);

    if (userCourseData) {
      // Load which specific videos were finished
      state.completedVideos = userCourseData.completedIndices || [];

      // Load certificate if they already finished it
      state.certificate = userCourseData.certificate || null;
    }
  }

  // 6. Start the Player
  displayCourse();
  checkCertificateStatus();
}

// Render the Playlist UI
function displayCourse() {
  document.getElementById("courseTitle").textContent = state.courseData.title;
  document.getElementById("courseDescription").textContent =
    state.courseData.description;

  const playlistContainer = document.getElementById("playlistContainer");
  playlistContainer.innerHTML = "";

  state.courseData.videos.forEach((video, index) => {
    const isCompleted = state.completedVideos.includes(index);

    const item = document.createElement("div");
    item.className = `playlist-item ${isCompleted ? "completed" : ""}`;
    item.onclick = () => playVideo(index);

    item.innerHTML = `
        <div class="video-number">${index + 1}</div>
        <div class="video-info">
            <h3>${video.title}</h3>
            <p>Duration: ${video.duration}</p>
        </div>
        <div class="check-icon">✓</div>
    `;

    playlistContainer.appendChild(item);
  });

  // Automatically play the first video if available
  if (state.courseData.videos.length > 0) {
    playVideo(0);
  }

  updateProgress();
}

// Play a specific video
function playVideo(index) {
  state.currentVideoIndex = index;
  const video = state.courseData.videos[index];

  document.getElementById("videoPlayer").src = video.url;
  console.log(video.url);
  document.getElementById("currentVideoTitle").textContent = video.title;

  // Update Active Styling
  document.querySelectorAll(".playlist-item").forEach((item, i) => {
    item.classList.remove("active");
    if (i === index) {
      item.classList.add("active");
    }
  });

  // Mark as Watched
  markAsCompleted(index);

  // Update Prev/Next Buttons
  updateNavButtons();
}

// Mark video as complete & Save to Storage
function markAsCompleted(index) {
  if (!state.completedVideos.includes(index)) {
    state.completedVideos.push(index);

    // Update Visuals
    const items = document.querySelectorAll(".playlist-item");
    if (items[index]) {
      items[index].classList.add("completed");
    }

    updateProgress();
    saveUserProgress(); // Save to localStorage
  }
}

// Save Progress to User's Enrollment Data
function saveUserProgress() {
  const userEmail = localStorage.getItem("loggedInUserEmail");
  if (!userEmail || !state.courseData) return;

  const key = `enrolledCourses_${userEmail}`;
  const enrolledCourses = JSON.parse(localStorage.getItem(key)) || [];

  // Find course in user's list
  const courseIndex = enrolledCourses.findIndex(
    (c) => c.id === state.courseData.id,
  );

  if (courseIndex !== -1) {
    const total = state.courseData.videos.length;
    const completed = state.completedVideos.length;
    const percentage = Math.round((completed / total) * 100);

    // Update Progress
    enrolledCourses[courseIndex].progress = percentage;
    // Save exactly which videos are done
    enrolledCourses[courseIndex].completedIndices = state.completedVideos;
    // Save certificate if exists
    if (state.certificate) {
      enrolledCourses[courseIndex].certificate = state.certificate;
    }

    localStorage.setItem(key, JSON.stringify(enrolledCourses));
  }
}

// Update Progress Bar
function updateProgress() {
  if (!state.courseData) return;

  const total = state.courseData.videos.length;
  const completed = state.completedVideos.length;
  const percentage = Math.round((completed / total) * 100);

  document.getElementById("progressStats").textContent =
    `${completed}/${total} videos completed`;
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    progressBar.style.width = percentage + "%";
    progressBar.textContent = percentage + "%";
  }

  // Trigger Certificate if 100%
  if (completed === total && total > 0) {
    if (!state.certificate) {
      setTimeout(() => {
        showCertificateForm();
      }, 1000);
    } else {
      checkCertificateStatus();
    }
  }
}

// Navigation Controls
function playNextVideo() {
  if (state.currentVideoIndex < state.courseData.videos.length - 1) {
    playVideo(state.currentVideoIndex + 1);
  }
}

function playPrevVideo() {
  if (state.currentVideoIndex > 0) {
    playVideo(state.currentVideoIndex - 1);
  }
}

function updateNavButtons() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  if (!prevBtn || !nextBtn) return;

  prevBtn.disabled = state.currentVideoIndex === 0;
  nextBtn.disabled =
    state.currentVideoIndex === state.courseData.videos.length - 1;
}

// Helper: Empty State
function showEmptyState(msg) {
  document.getElementById("contentWrapper").innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 50px;">
          <h3>⚠️ ${msg}</h3>
          <p>Please go back and select a course.</p>
          <a href="index.html" class="btn btn-primary" style="display:inline-block; margin-top:15px; text-decoration:none; background:#667eea; color:white; padding:10px 20px; border-radius:5px;">Back Home</a>
      </div>
  `;
}

// --- CERTIFICATE LOGIC ---

function showCertificateForm() {
  const formModal = document.getElementById("formModal");
  if (formModal && !formModal.classList.contains("active")) {
    formModal.classList.add("active");

    // Auto-fill name
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const email = localStorage.getItem("loggedInUserEmail");
    const user = users.find((u) => u.email === email);

    if (user && document.getElementById("nameInput")) {
      document.getElementById("nameInput").value =
        `${user.firstName} ${user.lastName}`;
    }
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("nameInput").value.trim();

  const certData = {
    name: name,
    courseName: state.courseData.title,
    date: new Date().toLocaleDateString(),
    id: "CERT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
  };

  state.certificate = certData;
  saveUserProgress(); // Save cert to user storage

  document.getElementById("formModal").classList.remove("active");
  displayCertificate();
  checkCertificateStatus();
}

function displayCertificate() {
  if (!state.certificate) return;
  document.getElementById("displayName").textContent = state.certificate.name;
  document.getElementById("displayCourse").textContent =
    state.certificate.courseName;
  document.getElementById("displayDate").textContent = state.certificate.date;
  document.getElementById("displayId").textContent = state.certificate.id;
  document.getElementById("certModal").classList.add("active");
}

function viewMyCertificate() {
  if (state.certificate) displayCertificate();
}

function closeCertModal() {
  document.getElementById("certModal").classList.remove("active");
}

function printCertificate() {
  window.print();
}

function checkCertificateStatus() {
  const viewBtn = document.getElementById("viewCertBtn");
  const badge = document.getElementById("certifiedBadge");

  if (state.certificate) {
    if (viewBtn) viewBtn.style.display = "flex";
    if (badge) badge.style.display = "block";
  }
}
