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

let allProjects = [];
let visibleCount = PAGE_SIZE;

function showLoading(isLoading) {
  loadingSpinner.style.display = isLoading ? "block" : "none";
}

function setStatus(text) {
  statusMessage.textContent = text;
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
      const matchesLanguage = language === "all" || (project.language || "Necunoscut") === language;
      return matchesSearch && matchesLanguage;
    })
  );
}

function buildLanguageFilter(projects) {
  const languages = [...new Set(projects.map((project) => project.language || "Necunoscut"))].sort();
  languageFilter.innerHTML = '<option value="all">Toate</option>';

  for (const language of languages) {
    const option = document.createElement("option");
    option.value = language;
    option.textContent = language;
    languageFilter.appendChild(option);
  }
}

function createCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";

  const title = document.createElement("h3");
  title.textContent = project.name;

  const description = document.createElement("p");
  description.textContent = project.description || "Fără descriere disponibilă";

  const language = document.createElement("p");
  language.className = "project-language";
  language.textContent = `Limbaj: ${project.language || "Necunoscut"}`;

  const meta = document.createElement("div");
  meta.className = "project-meta";
  meta.textContent = `⭐ ${project.stargazers_count} | Forks: ${project.forks_count}`;

  const link = document.createElement("a");
  link.className = "project-link";
  link.href = project.html_url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Vezi codul sursă";

  card.append(title, description, language, meta, link);
  return card;
}

function renderProjects() {
  const projects = getFilteredProjects();
  const visibleProjects = projects.slice(0, visibleCount);

  projectsGrid.innerHTML = "";
  visibleProjects.forEach((project) => projectsGrid.appendChild(createCard(project)));

  if (!projects.length) {
    setStatus("Nu există proiecte care să corespundă filtrului curent.");
  } else {
    setStatus(`Afișare ${visibleProjects.length} din ${projects.length} proiecte.`);
  }

  loadMoreBtn.style.display = projects.length > visibleProjects.length ? "inline-block" : "none";
}

async function loadFallbackProjects() {
  const response = await fetch("./fallback-projects.json");
  if (!response.ok) {
    throw new Error("Fallback indisponibil");
  }
  return response.json();
}

async function init() {
  showLoading(true);
  setStatus("Se încarcă proiectele...");

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("GitHub API error");
    }

    const repos = await response.json();
    const ownRepos = repos.filter((repo) => repo.fork === false);

    if (ownRepos.length < 5) {
      setStatus("Sunt prea puține proiecte publice. Afișăm o listă demonstrativă.");
      allProjects = await loadFallbackProjects();
    } else {
      allProjects = ownRepos;
    }

    buildLanguageFilter(allProjects);
    renderProjects();
  } catch (error) {
    try {
      allProjects = await loadFallbackProjects();
      setStatus("Ups! Nu am putut încărca proiectele momentan. Afișăm proiecte locale.");
      buildLanguageFilter(allProjects);
      renderProjects();
    } catch {
      setStatus("Ups! Nu am putut încărca proiectele momentan.");
      projectsGrid.innerHTML = "";
      loadMoreBtn.style.display = "none";
    }
  } finally {
    showLoading(false);
  }
}

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
  renderProjects();
});

loadMoreBtn.addEventListener("click", () => {
  visibleCount += PAGE_SIZE;
  renderProjects();
});

init();
