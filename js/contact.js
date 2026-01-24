document.addEventListener("DOMContentLoaded", () => {
  if (typeof emailjs === "undefined") {
    alert("Error: Email service not available. Please refresh the page.");
    return;
  }

  const form = document.getElementById("contactForm");
  const emailInput = document.getElementById("email");
  const nameInput = document.getElementById("name");
  const messageInput = document.getElementById("message");
  const loggedInEmail = localStorage.getItem("loggedInUserEmail");

  let currentUser = null;

  if (loggedInEmail) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === loggedInEmail);
    if (user) {
      currentUser = user;
      emailInput.value = user.email;
      emailInput.readOnly = true;
      nameInput.value = user.firstName + " " + user.lastName;
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all fields!");
      return;
    }

    console.log(" Form data:", {
      name,
      email,
      messageLength: message.length,
    });

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      const messages =
        JSON.parse(localStorage.getItem("contactMessages")) || [];
      messages.push({
        name,
        email,
        message,
        date: new Date().toISOString(),
      });
      localStorage.setItem("contactMessages", JSON.stringify(messages));
    } catch (error) {
      console.error(" LocalStorage error:", error);
    }

    try {
      const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
      };

      const response = await emailjs.send(
        "service_ayrfj6w",
        "template_bxyaa3c",
        templateParams,
      );

      alert("Message sent successfully! We'll get back to you soon ");

      form.reset();

      if (currentUser) {
        emailInput.value = currentUser.email;
        emailInput.readOnly = true;
        nameInput.value = currentUser.firstName + " " + currentUser.lastName;
      }
    } catch (error) {
      let errorMessage = "Failed to send email. ";

      if (error.status === 400) {
        errorMessage +=
          "Please check your Service ID and Template ID in the code.";
      } else if (error.status === 401 || error.status === 403) {
        errorMessage += "Authentication error. Check your Public Key.";
      } else if (error.status === 404) {
        errorMessage += "Service or Template not found.";
      } else if (error.text) {
        errorMessage += error.text;
      }

      errorMessage += "\n\nYour message has been saved locally.";
      alert(errorMessage);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
});
