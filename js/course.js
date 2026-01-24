const COURSES_KEY = "courses";

//set and get helper functions
function getCourses() {
  return JSON.parse(localStorage.getItem(COURSES_KEY)) || [];
}

function saveCourses(courses) {
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
}
// add for the first time
(function seedCourses() {
  if (!localStorage.getItem(COURSES_KEY)) {
    const initialCourses = [
      {
        id: Date.now(),
        title: "Complete Web Development Bootcamp",
        description:
          "Master HTML, CSS, JavaScript, and modern web development from scratch",
        category: "web",
        image: "https://picsum.photos/300/200?random=6",
        instructor: "Sohyla Gomaa",
        instructorBio: "Full Stack Developer",
        lessons: [
          {
            id: 1,
            title: "1. Introduction to HTML - Web Structure",
            video: "https://www.youtube.com/embed/qz0aGYrrlhU",
            duration: "15:30",
          },
          {
            id: 2,
            title: "2. CSS Fundamentals - Styling Your Pages",
            video: "https://www.youtube.com/embed/1PnVor36_40",
            duration: "20:45",
          },
        ],
      },
    ];
    saveCourses(initialCourses);
  }
})();

const coursesTableBody = document.getElementById("coursesTableBody");
function renderCourses() {
  const courses = getCourses();
  coursesTableBody.innerHTML = "";

  courses.forEach((course) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${course.title}</td>
      <td>${course.category}</td>
      <td>${course.instructor}</td>
      <td>
        <button class="btn btn-primary" onclick="editCourse(${course.id})">Edit</button>
        <button class="btn btn-outline" onclick="deleteCourse(${course.id})">Delete</button>
      </td>
    `;

    coursesTableBody.appendChild(tr);
  });
}
renderCourses();

const lessonsContainer = document.getElementById("lessonsContainer");
function addLessonField(lesson = {}) {
  const div = document.createElement("div");
  div.classList.add("lesson-item");

  div.innerHTML = `
    <input type="text" class="lesson-title" value="${lesson.title || ""}" placeholder="Lesson Title" />

    <input type="text" class="lesson-video" value="${lesson.video || ""}" placeholder="Video URL" />

    <input type="text" class="lesson-duration" value="${lesson.duration || ""}" placeholder="e.g 10:00" />

    <button type="button" class="btn btn-danger" onclick="this.parentElement.remove()" style="background: #ff4d4d; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 4px;">
        ✕
    </button>
  `;

  const container = document.getElementById("lessonsContainer");
  container.appendChild(div);

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function getLessonsFromForm() {
  const lessons = [];
  document.querySelectorAll(".lesson-item").forEach((item, index) => {
    lessons.push({
      id: Date.now() + index,
      title: item.querySelector(".lesson-title").value,
      video: item.querySelector(".lesson-video").value,
      duration: item.querySelector(".lesson-duration").value,
    });
  });
  return lessons;
}

///
//delete functionality
function deleteCourse(id) {
  if (!confirm("Are you sure you want to delete this course?")) return;

  let courses = getCourses();
  courses = courses.filter((course) => course.id !== id);

  saveCourses(courses);
  renderCourses();
  updateDashboardCounters();
}
//--------------------------
const modal = document.getElementById("courseModal");
const formTitle = document.getElementById("formTitle");
// add courses form
function openAddForm() {
  formTitle.textContent = "Add Course";
  document.getElementById("courseForm").reset();
  document.getElementById("courseId").value = "";
  lessonsContainer.innerHTML = "";
  clearErrors();
  populateCategoryDropdown();
  modal.classList.remove("hidden");
}
//edit courses form
function openEditForm(course) {
  formTitle.textContent = "Edit Course";

  courseId.value = course.id;
  title.value = course.title;
  description.value = course.description;
  image.value = course.image;
  instructor.value = course.instructor;
  instructorBio.value = course.instructorBio;
  clearErrors();
  populateCategoryDropdown();
  categorySelect.value = course.category;
  lessonsContainer.innerHTML = "";
  course.lessons.forEach((lesson) => addLessonField(lesson));
  modal.classList.remove("hidden");
}
//for closing courses add/edit form
function closeModal() {
  modal.classList.add("hidden");
}
//for clearing erros
function clearErrors() {
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
}

function validateForm() {
  let valid = true;

  if (!title.value.trim()) {
    titleError.textContent = "Title is required";
    valid = false;
  }

  if (!description.value.trim()) {
    descriptionError.textContent = "Description is required";
    valid = false;
  }

  if (!categorySelect.value.trim()) {
    categoryError.textContent = "Category is required";
    valid = false;
  }

  if (!instructor.value.trim()) {
    instructorError.textContent = "Instructor name is required";
    valid = false;
  }
  if (getLessonsFromForm().length === 0) {
    alert("Please add at least one lesson");
    valid = false;
  }

  return valid;
}
//======= add/edit courses
document.getElementById("courseForm").addEventListener("submit", function (e) {
  e.preventDefault();
  clearErrors();

  if (!validateForm()) return;

  const courses = getCourses();
  const id = courseId.value;
  const lessons = getLessonsFromForm();

  if (id) {
    // EDIT
    const course = courses.find((c) => c.id == id);
    course.title = title.value;
    course.description = description.value;
    course.image = image.value;
    course.category = categorySelect.value;
    course.instructor = instructor.value;
    course.instructorBio = instructorBio.value;
    course.lessons = lessons;
  } else {
    // ADD
    courses.push({
      id: Date.now(),
      title: title.value,
      description: description.value,
      image: image.value,
      category: categorySelect.value,
      instructor: instructor.value,
      instructorBio: instructorBio.value,
      lessons: lessons,
    });
  }

  saveCourses(courses);
  renderCourses();
  closeModal();
  updateDashboardCounters();
});

function editCourse(id) {
  const course = getCourses().find((c) => c.id === id);
  if (!course) return;
  openEditForm(course);
}

//add Category list
const categorySelect = document.getElementById("categorySelect");

function populateCategoryDropdown(selectedId = null) {
  const categories = getCategories();
  categorySelect.innerHTML = "";

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.name;
    option.textContent = cat.name;
    if (selectedId && selectedId == cat.id) {
      option.selected = true;
    }
    categorySelect.appendChild(option);
  });
}
