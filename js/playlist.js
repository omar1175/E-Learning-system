const state = {
  courseData: null,
  completedVideos: [],
  currentVideoIndex: 0,
  certificate: null,
};

document.addEventListener("DOMContentLoaded", () => {
  loadCourseData();
});

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

function saveToStorage(data) {
  localStorage.setItem("eLearningCourse", JSON.stringify(data));
}

function getFromStorage() {
  const data = localStorage.getItem("eLearningCourse");
  return data ? JSON.parse(data) : null;
}

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
                        <p>Duration: ${video.duration || "Not specified"}</p>
                    </div>
                    <div class="check-icon">✓</div>
                `;

    playlistContainer.appendChild(item);
  });

  if (state.courseData.videos.length > 0) {
    playVideo(0);
  }

  updateProgress();
}

function playVideo(index) {
  state.currentVideoIndex = index;
  const video = state.courseData.videos[index];

  document.getElementById("videoPlayer").src = video.url;
  document.getElementById("currentVideoTitle").textContent = video.title;
  document.querySelectorAll(".playlist-item").forEach((item, i) => {
    item.classList.remove("active");
    if (i === index) {
      item.classList.add("active");
    }
  });

  markAsCompleted(index);
}
function markAsCompleted(index) {
  if (!state.completedVideos.includes(index)) {
    state.completedVideos.push(index);
    const stored = getFromStorage();
    if (stored) {
      stored.completed = state.completedVideos;
      saveToStorage(stored);
    }
    const items = document.querySelectorAll(".playlist-item");
    if (items[index]) {
      items[index].classList.add("completed");
    }

    updateProgress();
  }
}

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

function showCertificateForm() {
  const formModal = document.getElementById("formModal");
  if (!formModal.classList.contains("active")) {
    formModal.classList.add("active");
    if (state.certificate) {
      document.getElementById("nameInput").value = state.certificate.name || "";
      document.getElementById("emailInput").value =
        state.certificate.email || "";
    }
  }
}

function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("nameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();

  if (!name) {
    alert("Please enter your name");
    return;
  }
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
  const stored = getFromStorage();
  if (stored) {
    stored.certificate = certData;
    saveToStorage(stored);
  }

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
  if (state.certificate) {
    displayCertificate();
  }
}

function closeCertModal() {
  document.getElementById("certModal").classList.remove("active");
  document.getElementById("formModal").classList.remove("active");
}

function printCertificate() {
  window.print();
}

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

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeCertModal();
  }
});

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

function playVideo(index) {
  state.currentVideoIndex = index;
  const video = state.courseData.videos[index];

  document.getElementById("videoPlayer").src = video.url;
  document.getElementById("currentVideoTitle").textContent = video.title;
  document.querySelectorAll(".playlist-item").forEach((item, i) => {
    item.classList.remove("active");
    if (i === index) {
      item.classList.add("active");
    }
  });

  if (!state.completedVideos.includes(index)) {
    markAsCompleted(index);
  }

  updateNavButtons();
}
