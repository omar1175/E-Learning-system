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

// Sample Course Data
function loadSampleData() {
  const sampleCourse = {
    title: "Complete Web Development Bootcamp",
    description:
      "Master HTML, CSS, JavaScript, and modern web development from scratch",
    videos: [
      {
        title: "1. Introduction to HTML - Web Structure",
        url: "https://www.youtube.com/embed/qz0aGYrrlhU",
        duration: "15:30",
      },
      {
        title: "2. CSS Fundamentals - Styling Your Pages",
        url: "https://www.youtube.com/embed/1PnVor36_40",
        duration: "20:45",
      },
      {
        title: "3. JavaScript Basics - Programming Logic",
        url: "https://www.youtube.com/embed/W6NZfCO5SIk",
        duration: "25:15",
      },
      {
        title: "4. Responsive Web Design - Mobile First",
        url: "https://www.youtube.com/embed/srvUrASNj0s",
        duration: "18:20",
      },
      {
        title: "5. DOM Manipulation - Interactive Websites",
        url: "https://www.youtube.com/embed/y17RuWkWdn8",
        duration: "22:10",
      },
    ],
  };

  saveToStorage({ course: sampleCourse, completed: [] });
  loadCourseData();
}

// Storage Functions
function saveToStorage(data) {
  localStorage.setItem("eLearningCourse", JSON.stringify(data));
}

function getFromStorage() {
  const data = localStorage.getItem("eLearningCourse");
  return data ? JSON.parse(data) : null;
}

// Load Course Data
function loadCourseData() {
  const stored = getFromStorage();

  if (
    !stored ||
    !stored.course ||
    !stored.course.videos ||
    stored.course.videos.length === 0
  ) {
    showEmptyState();
    return;
  }

  state.courseData = stored.course;
  state.completedVideos = stored.completed || [];
  state.certificate = stored.certificate || null;

  displayCourse();
  checkCertificateStatus();
}

// Empty State
function showEmptyState() {
  document.getElementById("contentWrapper").innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <h3>📚 No Course Data Found</h3>
                    <p style="margin: 20px 0;">Load sample course data to get started with your learning journey!</p>
                    <button class="sample-data-btn" onclick="loadSampleData()">
                        🚀 Load Sample Course
                    </button>
                </div>
            `;
  document.getElementById("courseTitle").textContent = "Welcome to E-Learning";
  document.getElementById("courseDescription").textContent =
    "Please load a course to begin";
}

// Display Course
function displayCourse() {
  document.getElementById("courseTitle").textContent = state.courseData.title;
  document.getElementById("courseDescription").textContent =
    state.courseData.description;

  const playlistContainer = document.getElementById("playlistContainer");
  playlistContainer.innerHTML = "";

  state.courseData.videos.forEach((video, index) => {
    const isCompleted = state.completedVideos.includes(index);

    // REMOVED: const isActive = ...
    // We let playVideo(0) handle the active class later so it syncs with the player.

    const item = document.createElement("div");
    item.className = `playlist-item ${isCompleted ? "completed" : ""}`;
    item.onclick = () => playVideo(index);

    item.innerHTML = `
                    <div class="video-number">${index + 1}</div>
                    <div class="video-info">
                        <h3>${video.title}</h3>
                        <p>Duration: ${video.duration || "Not specified"}</p>
                    </div>
                    <div class="check-icon">✓</div>
                `;

    playlistContainer.appendChild(item);
  });

  // ADDED: Select the first video by default
  // This loads the iframe source, highlights the item, and sets button states.
  if (state.courseData.videos.length > 0) {
    playVideo(0);
  }

  updateProgress();
}
// Play Video
function playVideo(index) {
  state.currentVideoIndex = index;
  const video = state.courseData.videos[index];

  document.getElementById("videoPlayer").src = video.url;
  document.getElementById("currentVideoTitle").textContent = video.title;

  // Update UI Highlight
  document.querySelectorAll(".playlist-item").forEach((item, i) => {
    item.classList.remove("active");
    if (i === index) {
      item.classList.add("active");
    }
  });

  // Mark as completed immediately when clicked/played
  markAsCompleted(index);
}

// Mark as Completed
function markAsCompleted(index) {
  if (!state.completedVideos.includes(index)) {
    state.completedVideos.push(index);

    // Save progress
    const stored = getFromStorage();
    if (stored) {
      stored.completed = state.completedVideos;
      saveToStorage(stored);
    }

    // Visual update
    const items = document.querySelectorAll(".playlist-item");
    if (items[index]) {
      items[index].classList.add("completed");
    }

    updateProgress();
  }
}

// Update Progress & Trigger Certificate
function updateProgress() {
  if (!state.courseData) return;

  const total = state.courseData.videos.length;
  const completed = state.completedVideos.length;
  const percentage = Math.round((completed / total) * 100);

  document.getElementById("progressStats").textContent =
    `${completed}/${total} videos completed`;
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage + "%";
  progressBar.textContent = percentage + "%";

  // Check if course completed and certificate NOT yet generated
  if (completed === total && total > 0) {
    if (!state.certificate) {
      // Small delay to allow user to realize they hit 100%
      setTimeout(() => {
        showCertificateForm();
      }, 1000);
    } else {
      checkCertificateStatus();
    }
  }
}

// Show Certificate Form
function showCertificateForm() {
  // Only show if not already showing
  const formModal = document.getElementById("formModal");
  if (!formModal.classList.contains("active")) {
    formModal.classList.add("active");

    // Pre-fill if some data exists
    if (state.certificate) {
      document.getElementById("nameInput").value = state.certificate.name || "";
      document.getElementById("emailInput").value =
        state.certificate.email || "";
    }
  }
}

// Handle Form Submit
function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("nameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();

  if (!name) {
    alert("Please enter your name");
    return;
  }

  // Generate Certificate Data
  const today = new Date();
  const certData = {
    name: name,
    email: email,
    courseName: state.courseData.title,
    date: today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    id:
      "CERT-" +
      today.getFullYear() +
      "-" +
      Math.random().toString(36).substr(2, 6).toUpperCase(),
    generatedAt: today.toISOString(),
  };

  state.certificate = certData;

  // Save to storage
  const stored = getFromStorage();
  if (stored) {
    stored.certificate = certData;
    saveToStorage(stored);
  }

  // Close form and show certificate
  document.getElementById("formModal").classList.remove("active");
  displayCertificate();
  checkCertificateStatus();
}

// Display Certificate Modal
function displayCertificate() {
  if (!state.certificate) return;

  document.getElementById("displayName").textContent = state.certificate.name;
  document.getElementById("displayCourse").textContent =
    state.certificate.courseName;
  document.getElementById("displayDate").textContent = state.certificate.date;
  document.getElementById("displayId").textContent = state.certificate.id;

  document.getElementById("certModal").classList.add("active");
}

// View My Certificate (Button Click)
function viewMyCertificate() {
  if (state.certificate) {
    displayCertificate();
  }
}

// Close Certificate Modal
function closeCertModal() {
  document.getElementById("certModal").classList.remove("active");
  document.getElementById("formModal").classList.remove("active");
}

// Print Certificate
function printCertificate() {
  window.print();
}

// Check Certificate Status (Updates UI Badges/Buttons)
function checkCertificateStatus() {
  const viewBtn = document.getElementById("viewCertBtn");
  const badge = document.getElementById("certifiedBadge");

  if (state.certificate) {
    viewBtn.style.display = "flex";
    badge.style.display = "block";
  } else {
    viewBtn.style.display = "none";
    badge.style.display = "none";
  }
}

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeCertModal();
  }
});

// --- ADD THESE NEW FUNCTIONS ---

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

  // Safety check if elements exist
  if (!prevBtn || !nextBtn) return;

  // Disable 'Previous' on first video
  prevBtn.disabled = state.currentVideoIndex === 0;

  // Disable 'Next' on last video
  nextBtn.disabled =
    state.currentVideoIndex === state.courseData.videos.length - 1;
}

// --- UPDATE YOUR EXISTING playVideo FUNCTION ---

function playVideo(index) {
  state.currentVideoIndex = index;
  const video = state.courseData.videos[index];

  // Update Player
  document.getElementById("videoPlayer").src = video.url;
  document.getElementById("currentVideoTitle").textContent = video.title;

  // Highlight active item
  document.querySelectorAll(".playlist-item").forEach((item, i) => {
    item.classList.remove("active");
    if (i === index) {
      item.classList.add("active");
    }
  });

  // Mark as completed
  if (!state.completedVideos.includes(index)) {
    markAsCompleted(index);
  }

  // NEW: Update buttons whenever video changes
  updateNavButtons();
}
