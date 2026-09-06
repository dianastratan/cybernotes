const root = document.documentElement;
const themeToggle = document.querySelector("#theme-toggle");
const menuToggle = document.querySelector("#menu-toggle");
const sidebar = document.querySelector(".sidebar");
const search = document.querySelector("#topic-search");
const topicLinks = [...document.querySelectorAll(".topic-link")];
const notes = [...document.querySelectorAll(".note")];
const crumb = document.querySelector("#crumb");
const noResults = document.querySelector("#no-results");
const topicCount = document.querySelector("#topic-count");

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("cyber-notes-theme", theme);
  const isLight = theme === "light";
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} theme`);
  themeToggle.querySelector(".toggle-text").textContent = isLight ? "Dark mode" : "Light mode";
}

setTheme(localStorage.getItem("cyber-notes-theme") || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));

themeToggle.addEventListener("click", () => setTheme(root.dataset.theme === "light" ? "dark" : "light"));

function selectTopic(id) {
  topicLinks.forEach((link) => {
    const selected = link.dataset.topic === id;
    link.classList.toggle("active", selected);
    link.toggleAttribute("aria-current", selected);
  });
  notes.forEach((note) => {
    const selected = note.id === id;
    note.hidden = !selected;
    note.classList.toggle("active", selected);
    if (selected) crumb.textContent = note.dataset.label;
  });
  sidebar.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.querySelector("#main-content").focus({ preventScroll: true });
}

topicLinks.forEach((link) => link.addEventListener("click", () => selectTopic(link.dataset.topic)));

search.addEventListener("input", () => {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  topicLinks.forEach((link) => {
    const match = link.textContent.toLowerCase().includes(query);
    link.closest("li").hidden = !match;
    visible += Number(match);
  });
  noResults.hidden = visible !== 0;
  topicCount.textContent = String(visible).padStart(2, "0");
});

menuToggle.addEventListener("click", () => {
  const open = sidebar.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    search.focus();
  }
  if (event.key === "Escape" && sidebar.classList.contains("open")) {
    sidebar.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.focus();
  }
});
