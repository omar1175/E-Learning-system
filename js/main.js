function sendData(courseId) {
  // 1️⃣ Get logged-in user
  const email = localStorage.getItem("loggedInUserEmail");
  if (!email) {
    alert("Please login first to add courses to your wishlist.");
    window.location.href = "login.html";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email);

  if (!user) {
    alert("User not found. Please login again.");
    localStorage.removeItem("loggedInUserEmail");
    window.location.href = "login.html";
    return;
  }

  // 2️⃣ Get the course from localStorage courses array
  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  const course = courses.find((c) => c.id == courseId);

  if (!course) {
    alert("Course not found.");
    return;
  }

  // 3️⃣ Check if already in wishlist
  const exists = user.wishList.some((c) => c.id == course.id);
  if (exists) {
    alert(`"${course.title}" is already in your wishlist.`);
    return;
  }

  // 4️⃣ Add to wishlist
  user.wishList.push({
    id: course.id,
    title: course.title,
    image: course.image,
  });

  // 5️⃣ Save back to localStorage
  const updatedUsers = users.map((u) => (u.email === email ? user : u));
  localStorage.setItem("users", JSON.stringify(updatedUsers));

  alert(`"${course.title}" added to your wishlist!`);
}
