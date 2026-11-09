// COS 106 Student Portfolio — JavaScript functionality
document.addEventListener("DOMContentLoaded", () => {
 // Update the copyright year on every page.
 document.querySelectorAll(".current-year").forEach((element) => {
 element.textContent = new Date().getFullYear();
 });
 // Mobile navigation menu.
 const menuButton = document.querySelector(".menu-toggle");
 const navLinks = document.querySelector(".nav-links");
 if (menuButton && navLinks) {
 menuButton.addEventListener("click", () => {
 const isOpen = navLinks.classList.toggle("open");
 menuButton.setAttribute("aria-expanded", String(isOpen));
 menuButton.textContent = isOpen ? "
✕" : "
■";
 });
 }
 setupAcademicPlanner();
 setupContactForm();
});
// ---------------- ACADEMIC PLANNER ----------------
function setupAcademicPlanner() {
 const taskForm = document.getElementById("task-form");
 const taskList = document.getElementById("task-list");
 if (!taskForm || !taskList) return;
 const taskInput = document.getElementById("task-input");
 const taskDate = document.getElementById("task-date");
 const taskCategory = document.getElementById("task-category");
 const taskFeedback = document.getElementById("task-feedback");
 const taskCount = document.getElementById("task-count");
 const filterButtons = document.querySelectorAll(".filter-btn");
 // An array stores the tasks. Local storage keeps them after a page refresh.
 let tasks = [];
 try {
 tasks = JSON.parse(localStorage.getItem("cos106Tasks")) || [];
 if (!Array.isArray(tasks)) tasks = [];
 } catch (error) {
 tasks = [];
 }
 let currentFilter = "all";
 function saveTasks() {
 localStorage.setItem("cos106Tasks", JSON.stringify(tasks));
 }
 function updateTaskCount() {
 const pending = tasks.filter((task) => !task.completed).length;
 taskCount.textContent = `${pending} pending / ${tasks.length} total`;
 }
 function renderTasks() {
Page 15
 taskList.innerHTML = "";
 const visibleTasks = tasks.filter((task) => {
 if (currentFilter === "active") return !task.completed;
 if (currentFilter === "completed") return task.completed;
 return true;
 });
 if (visibleTasks.length === 0) {
 const emptyMessage = document.createElement("li");
 emptyMessage.className = "empty-state";
 emptyMessage.textContent = tasks.length === 0
 ? "No tasks yet. Add your first task above."
 : "There are no tasks in this filter.";
 taskList.appendChild(emptyMessage);
 }
 visibleTasks.forEach((task) => {
 const item = document.createElement("li");
 item.className = `task-item${task.completed ? " completed" : ""}`;
 const checkbox = document.createElement("input");
 checkbox.type = "checkbox";
 checkbox.className = "task-check";
 checkbox.checked = task.completed;
 checkbox.setAttribute("aria-label", `Mark ${task.title} as completed`);
 checkbox.addEventListener("change", () => {
 const selectedTask = tasks.find((entry) => entry.id === task.id);
 if (selectedTask) {
 selectedTask.completed = checkbox.checked;
 saveTasks();
 renderTasks();
 }
 });
 const details = document.createElement("div");
 details.className = "task-details";
 const title = document.createElement("strong");
 title.textContent = task.title;
 const metadata = document.createElement("small");
 metadata.textContent = `${task.category}${task.dueDate ? " • Due: " + task.dueDate : ""}`;
 details.append(title, metadata);
 const deleteButton = document.createElement("button");
 deleteButton.type = "button";
 deleteButton.className = "delete-task";
 deleteButton.textContent = "Delete";
 deleteButton.setAttribute("aria-label", `Delete ${task.title}`);
 deleteButton.addEventListener("click", () => {
 tasks = tasks.filter((entry) => entry.id !== task.id);
 saveTasks();
 renderTasks();
 });
 item.append(checkbox, details, deleteButton);
 taskList.appendChild(item);
 });
 updateTaskCount();
 }
 taskForm.addEventListener("submit", (event) => {
 event.preventDefault();
Page 16
 const title = taskInput.value.trim();
 if (!title) {
 taskFeedback.textContent = "Please enter a task description.";
 taskInput.focus();
 return;
 }
 // Each task is an object stored in the tasks array.
 const newTask = {
 id: Date.now(),
 title: title,
 dueDate: taskDate.value,
 category: taskCategory.value,
 completed: false
 };
 tasks.push(newTask);
 saveTasks();
 renderTasks();
 taskForm.reset();
 taskFeedback.textContent = "Task added successfully.";
 taskInput.focus();
 });
 filterButtons.forEach((button) => {
 button.addEventListener("click", () => {
 currentFilter = button.dataset.filter;
 filterButtons.forEach((item) => item.classList.remove("selected"));
 button.classList.add("selected");
 renderTasks();
 });
 });
 renderTasks(); }
// ---------------- CONTACT FORM VALIDATION ----------------
function setupContactForm() {
 const contactForm = document.getElementById("contact-form");
 if (!contactForm) return;
 const fields = {
 name: document.getElementById("contact-name"),
 email: document.getElementById("contact-email"),
 phone: document.getElementById("contact-phone"),
 message: document.getElementById("contact-message")
 };
 const feedback = document.getElementById("contact-feedback");
 function showError(fieldName, message) {
 const field = fields[fieldName];
 const errorElement = document.getElementById(`${fieldName}-error`);
 errorElement.textContent = message;
 field.classList.toggle("invalid", Boolean(message));
 field.setAttribute("aria-invalid", String(Boolean(message)));
 }
 function validateContactForm() {
 let isValid = true;
 const name = fields.name.value.trim();
Page 17
 const email = fields.email.value.trim();
 const phone = fields.phone.value.trim();
 const message = fields.message.value.trim();
 // Check that every required field contains a value.
 if (!name) {
 showError("name", "Please enter your name.");
 isValid = false;
 } else showError("name", "");
 // Check the email format.
 const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 if (!email) {
 showError("email", "Please enter your email address.");
 isValid = false;
 } else if (!emailPattern.test(email)) {
 showError("email", "Please enter a valid email address.");
 isValid = false;
 } else showError("email", "");
 // Assessment requirement: phone number must contain digits only.
 const phonePattern = /^\d+$/;
 if (!phone) {
 showError("phone", "Please enter your phone number.");
 isValid = false;
 } else if (!phonePattern.test(phone)) {
 showError("phone", "Phone number must contain digits only.");
 isValid = false;
 } else showError("phone", "");
 if (!message) {
 showError("message", "Please enter a message.");
 isValid = false;
 } else showError("message", "");
 return isValid;
 }
 contactForm.addEventListener("submit", (event) => {
 event.preventDefault();
 if (validateContactForm()) {
 feedback.textContent = "All fields are valid. Your form is ready for submission.";
 contactForm.reset();
 } else {
 feedback.textContent = "Please correct the highlighted fields.";
 }
 });
 // Clear a field's error as the user edits it.
 Object.entries(fields).forEach(([fieldName, field]) => {
 field.addEventListener("input", () => {
 showError(fieldName, "");
 feedback.textContent = "";
 });
 });
}