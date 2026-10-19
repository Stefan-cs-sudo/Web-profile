const USERNAME = "Stefan-cs-sudo";
const API_URL = `https://api.github.com/users/${USERNAME}/repos?per_page=100`;
const PAGE_SIZE = 6;

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const languageFilter = document.getElementById("languageFilter");
const projectsGrid = document.getElementById("projectsGrid");
const loadingSpinner = document.getElementById("loadingSpinner");
const statusMessage = document.getElementById("statusMessage");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const categoryFilters = document.getElementById("categoryFilters");
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const contactForm = document.getElementById("contactForm");
const messageInput = document.getElementById("contactMessage");
const messageCount = document.getElementById("messageCount");
const formStatus = document.getElementById("formStatus");

let allProjects = [];
let visibleCount = PAGE_SIZE;
let statusNotice = "";

function showLoading(isLoading) {
  loadingSpinner.style.display = isLoading ? "block" : "none";
}

function setStatus(text) {
  statusMessage.textContent = text;
}

function setStatusNotice(text) {
  statusNotice = text;
}

function sortProjects(projects) {
  const sortBy = sortSelect.value;
  const sorted = [...projects];

  if (sortBy === "stars") {
    sorted.sort((a, b) => b.stargazers_count - a.stargazers_count);
    return sorted;
  }

  sorted.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  return sorted;
}

function getFilteredProjects() {
  const term = searchInput.value.trim().toLowerCase();
  const language = languageFilter.value;

  return sortProjects(
    allProjects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(term) ||
        (project.description || "").toLowerCase().includes(term);
      const matchesLanguage = language === "all" || (project.language || "Unknown") === language;
      return matchesSearch && matchesLanguage;
    })
  );
}

function buildLanguageFilter(projects) {
  const languages = [...new Set(projects.map((project) => project.language || "Unknown"))].sort();
  languageFilter.innerHTML = '<option value="all">All</option>';
  categoryFilters.innerHTML = "";

  const allButton = createCategoryButton("all", "All");
  allButton.classList.add("active");
  categoryFilters.appendChild(allButton);

  for (const language of languages) {
    const option = document.createElement("option");
    option.value = language;
    option.textContent = language;
    languageFilter.appendChild(option);
    categoryFilters.appendChild(createCategoryButton(language, language));
  }
}

function createCategoryButton(category, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "filter-button";
  button.dataset.category = category;
  button.textContent = label;
  button.addEventListener("click", () => {
    languageFilter.value = category;
    categoryFilters.querySelectorAll(".filter-button").forEach((item) => {
      item.classList.toggle("active", item === button);
    });
    visibleCount = PAGE_SIZE;
    renderProjects();
  });
  return button;
}

function createCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";

  const title = document.createElement("h3");
  title.textContent = project.name;

  const description = document.createElement("p");
  description.textContent = project.description || "No description available";

  const language = document.createElement("p");
  language.className = "project-language";
  language.textContent = `Language: ${project.language || "Unknown"}`;

  const meta = document.createElement("div");
  meta.className = "project-meta";
  meta.textContent = `⭐ ${project.stargazers_count} | Forks: ${project.forks_count}`;

  const link = document.createElement("a");
  link.className = "project-link";
  link.href = project.html_url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "View source code";

  card.append(title, description, language, meta, link);
  return card;
}

function renderProjects() {
  const projects = getFilteredProjects();
  const visibleProjects = projects.slice(0, visibleCount);

  projectsGrid.innerHTML = "";
  visibleProjects.forEach((project) => projectsGrid.appendChild(createCard(project)));

  let statusText = "";
  if (!projects.length) {
    statusText = "No projects match the current filter.";
  } else {
    statusText = `Showing ${visibleProjects.length} of ${projects.length} projects.`;
  }
  if (statusNotice) {
    statusText = `${statusNotice} ${statusText}`.trim();
  }
  setStatus(statusText);


  if (projects.length <= PAGE_SIZE) {
   
    loadMoreBtn.style.display = "none";
  } else if (visibleProjects.length >= projects.length) {
   
    loadMoreBtn.style.display = "inline-block";
    loadMoreBtn.textContent = "Show less";
    loadMoreBtn.setAttribute("data-action", "collapse");
  } else {
   
    loadMoreBtn.style.display = "inline-block";
    loadMoreBtn.textContent = "Load more";
    loadMoreBtn.setAttribute("data-action", "expand");
  }
}
/*
async function loadFallbackProjects() {
  const response = await fetch("./fallback-projects.json");
  if (!response.ok) {
    throw new Error("Fallback unavailable");
  }
  return response.json();
}
  */
/*
async function init() {
  if (!projectsGrid) return;
  showLoading(true);
  setStatusNotice("");
  setStatus("Loading projects...");

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("GitHub API error");
    }

    const repos = await response.json();
    const publicRepos = repos.filter((repo) => repo.private === false);
    const ownRepos = publicRepos.filter((repo) => repo.fork === false);

    if (ownRepos.length <= PAGE_SIZE) {
      setStatusNotice("Too few public projects. Showing a demo list.");
      allProjects = await loadFallbackProjects();
    } else {
      setStatusNotice("");
      allProjects = ownRepos;
    }

    buildLanguageFilter(allProjects);
    renderProjects();
  } catch (error) {
    try {
      allProjects = await loadFallbackProjects();
      setStatusNotice("Oops! We couldn't load the projects right now. Showing local projects.");
      buildLanguageFilter(allProjects);
      renderProjects();
    } catch {
      setStatusNotice("");
      setStatus("Oops! We couldn't load the projects right now.");
      projectsGrid.innerHTML = "";
      loadMoreBtn.style.display = "none";
    }
  } finally {
    showLoading(false);
  }
}
*/


async function init() {
  showLoading(true);
  setStatusNotice("");
  setStatus("Loading projects...");

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("GitHub API error");
    }

    const repos = await response.json();
    
 
    const ownRepos = repos.filter((repo) => repo.fork === false);

    if (ownRepos.length === 0) {
      setStatus("No public repositories found.");
      loadMoreBtn.style.display = "none";
      return;
    }

   
    allProjects = ownRepos;

    buildLanguageFilter(allProjects);
    renderProjects();
  } catch (error) {
    console.error(error);
    setStatus("Oops! We couldn't load the GitHub projects right now.");
    projectsGrid.innerHTML = "";
    loadMoreBtn.style.display = "none";
  } finally {
    showLoading(false);
  }
}


if (projectsGrid) {
searchInput.addEventListener("input", () => {
  visibleCount = PAGE_SIZE;
  renderProjects();
});

sortSelect.addEventListener("change", () => {
  visibleCount = PAGE_SIZE;
  renderProjects();
});

languageFilter.addEventListener("change", () => {
  visibleCount = PAGE_SIZE;
  categoryFilters.querySelectorAll(".filter-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === languageFilter.value);
  });
  renderProjects();
});


loadMoreBtn.addEventListener("click", () => {
  const action = loadMoreBtn.getAttribute("data-action");
  
  if (action === "collapse") {

    visibleCount = PAGE_SIZE;
    renderProjects();
    
    
    document.querySelector(".portfolio").scrollIntoView({ behavior: "smooth" });
  } else {
  
    visibleCount += PAGE_SIZE;
    renderProjects();
  }
});
}

function initMobileMenu() {
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    hamburger.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navMenu.classList.remove("is-open");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Open navigation");
    }
  });
}

function initScrollAnimations() {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach((element) => observer.observe(element));
}

function showFieldError(fieldName, message) {
  const field = contactForm.elements[fieldName];
  const error = contactForm.querySelector(`[data-error-for="${fieldName}"]`);
  field.classList.toggle("invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  error.textContent = message;
}

function validateField(fieldName) {
  const field = contactForm.elements[fieldName];
  const value = field.value.trim();
  let message = "";

  if (fieldName === "name" && !/^[A-Za-zÀ-ÿ ]{2,}$/.test(value)) {
    message = "Use at least 2 letters and spaces only.";
  } else if (fieldName === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    message = "Enter a valid email address.";
  } else if (fieldName === "phone" && value && !/^[0-9+() -]{7,}$/.test(value)) {
    message = "Use numbers, spaces, dashes, or parentheses.";
  } else if (fieldName === "message" && (value.length < 10 || value.length > 1000)) {
    message = "Message must contain 10-1000 characters.";
  }

  showFieldError(fieldName, message);
  return !message;
}

function initContactForm() {
  if (!contactForm) return;
  const fieldNames = ["name", "email", "phone", "message"];
  fieldNames.forEach((fieldName) => {
    contactForm.elements[fieldName].addEventListener("input", () => {
      validateField(fieldName);
      if (fieldName === "message") {
        messageCount.textContent = String(contactForm.elements.message.value.length);
      }
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const isValid = fieldNames.every((fieldName) => validateField(fieldName));
    if (!isValid) {
      formStatus.textContent = "Please correct the highlighted fields.";
      return;
    }
    formStatus.textContent = "Message validated successfully. Thank you!";
    contactForm.reset();
    messageCount.textContent = "0";
  });
}

initMobileMenu();
initScrollAnimations();
initContactForm();
init();