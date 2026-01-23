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
        title: "Advanced Python",
        description: "Take your Python skills to the next level.",
        image: "https://picsum.photos/300/200?random=6",
        category: "python",
        instructor: "Mohamed Samir",
        instructorBio: "Senior Python developer.",
        lessons: [
          {
            id: 1,
            title: "Functions & Modules",
            video: "",
            content: "Advanced Python functions",
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
//delete functionality
function deleteCourse(id) {
  if (!confirm("Are you sure you want to delete this course?")) return;

  let courses = getCourses();
  courses = courses.filter((course) => course.id !== id);

  saveCourses(courses);
  renderCourses();
}
//--------------------------
const modal = document.getElementById("courseModal");
const formTitle = document.getElementById("formTitle");
// add courses form
function openAddForm() {
  formTitle.textContent = "Add Course";
  document.getElementById("courseForm").reset();
  document.getElementById("courseId").value = "";
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

  if (!image.value.trim()) {
    imageError.textContent = "Image URL is required";
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

  return valid;
}
//======= add/edit courses
document.getElementById("courseForm").addEventListener("submit", function (e) {
  e.preventDefault();
  clearErrors();

  if (!validateForm()) return;

  const courses = getCourses();
  const id = courseId.value;

  if (id) {
    // EDIT
    const course = courses.find((c) => c.id == id);
    course.title = title.value;
    course.description = description.value;
    course.image = image.value;
    course.category = categorySelect.value;
    course.instructor = instructor.value;
    course.instructorBio = instructorBio.value;
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
      lessons: [],
    });
  }

  saveCourses(courses);
  renderCourses();
  closeModal();
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
