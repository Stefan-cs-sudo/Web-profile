# Web-profile

Personal CV/portfolio web page with an **IDE / Dev-Tools Dark Mode** theme that dynamically displays public GitHub projects.

## Features
- Profile section (name, role, bio, photo)
- Experience and education sections
- Integration with `https://api.github.com/users/USERNAME/repos`
- Project cards with:
  - name
  - description (fallback: `No description available`)
  - primary language
  - stars and forks
  - link to source code
- Only public, non-fork repositories are shown
- Client-side sorting (by `updated_at` or `stargazers_count`)
- Real-time filtering (search + language)
- UX states: loading spinner + friendly error messages
- If there are too few projects or the API fails, loads a fallback list from `fallback-projects.json`
- Incremental pagination via **Load more** (6 projects initially)
- Responsive design (mobile/tablet/desktop)

## Run locally
1. Clone the repository
2. Start a static server in the project root:
   - Python: `python -m http.server 8000`
3. Open `http://localhost:8000`

## Tech stack
- HTML5
- CSS3 (Grid/Flexbox)
- JavaScript (Fetch API)

## Deploy (free)
This project is ready to deploy on:
- **GitHub Pages**
- **Vercel**
- **Netlify**

For GitHub Pages:
1. Push to the main branch
2. `Settings -> Pages`
3. Choose the root directory for deployment
