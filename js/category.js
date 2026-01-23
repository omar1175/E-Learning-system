const CATEGORIES_KEY = "categories";

//set and get helper functions
function getCategories() {
  return JSON.parse(localStorage.getItem(CATEGORIES_KEY)) || [];
}
function saveCategories(categories) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}
// add for the first time
(function seedCategories() {
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    const initialCategories = [
      { id: Date.now(), name: "Programming" },
      { id: Date.now() + 1, name: "Web Design" },
    ];
    saveCategories(initialCategories);
  }
})();

//render
const categoriesTableBody = document.getElementById("categoriesTableBody");

function renderCategories() {
  const categories = getCategories();
  categoriesTableBody.innerHTML = "";

  if (categories.length === 0) {
    categoriesTableBody.innerHTML = `
      <tr>
        <td colspan="2">No categories found</td>
      </tr>
    `;
    return;
  }

  categories.forEach((category) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${category.name}</td>
      <td>
        <button class="btn btn-primary" onclick="editCategory(${category.id})">
          Edit
        </button>
        <button class="btn btn-outline" onclick="deleteCategory(${category.id})">
          Delete
        </button>
      </td>
    `;

    categoriesTableBody.appendChild(tr);
  });
}
renderCategories();

//Modal form controle
const categoryModal = document.getElementById("categoryModal");
const categoryFormTitle = document.getElementById("categoryFormTitle");

function openAddCategoryForm() {
  categoryFormTitle.textContent = "Add Category";
  categoryForm.reset();
  categoryId.value = "";
  clearCategoryErrors();
  categoryModal.classList.remove("hidden");
}

function openEditCategoryForm(category) {
  categoryFormTitle.textContent = "Edit Category";
  categoryId.value = category.id;
  categoryName.value = category.name;
  clearCategoryErrors();
  categoryModal.classList.remove("hidden");
}

function closeCategoryModal() {
  categoryModal.classList.add("hidden");
}
//validation
function clearCategoryErrors() {
  categoryNameError.textContent = "";
}

function validateCategoryForm() {
  if (!categoryName.value.trim()) {
    categoryNameError.textContent = "Category name is required";
    return false;
  }
  return true;
}

//submit add/edit
categoryForm.addEventListener("submit", function (e) {
  e.preventDefault();
  clearCategoryErrors();

  if (!validateCategoryForm()) return;

  const categories = getCategories();
  const id = categoryId.value;

  if (id) {
    // EDIT
    const category = categories.find((c) => c.id == id);
    category.name = categoryName.value;
  } else {
    // ADD
    categories.push({
      id: Date.now(),
      name: categoryName.value,
    });
  }

  saveCategories(categories);
  renderCategories();
  closeCategoryModal();
});

//delete category
function deleteCategory(id) {
  if (!confirm("Delete this category?")) return;

  let categories = getCategories();
  categories = categories.filter((c) => c.id !== id);

  saveCategories(categories);
  renderCategories();
}

//edit button
function editCategory(id) {
  const category = getCategories().find((c) => c.id === id);
  if (!category) return;
  openEditCategoryForm(category);
}
