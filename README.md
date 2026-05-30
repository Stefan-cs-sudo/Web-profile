# Web-profile

Pagină web personală (CV/Portofoliu) cu temă **IDE / Dev-Tools Dark Mode**, care afișează dinamic proiectele publice din GitHub API.

## Funcționalități
- Secțiune profil (nume, rol, bio, poză)
- Secțiune experiență și educație
- Integrare cu `https://api.github.com/users/USERNAME/repos`
- Carduri proiect cu:
  - nume
  - descriere (fallback: `Fără descriere disponibilă`)
  - limbaj principal
  - stele și fork-uri
  - link către codul sursă
- Excludere automată repo-uri fork (`fork === false`)
- Sortare client-side (după `updated_at` sau `stargazers_count`)
- Filtrare în timp real (search + limbaj)
- UX states: loading spinner + mesaj prietenos pentru erori
- Dacă sunt puține proiecte sau API-ul eșuează, se încarcă fallback din `fallback-projects.json`
- Paginare incrementală prin buton **Load More** (6 proiecte inițiale)
- Design responsive (telefon/tabletă/desktop)

## Rulare locală
1. Clonează repository-ul
2. Pornește un server static în directorul proiectului:
   - Python: `python -m http.server 8000`
3. Deschide `http://localhost:8000`

## Tehnologii
- HTML5
- CSS3 (Grid/Flexbox)
- JavaScript (Fetch API)

## Deploy (gratuit)
Proiectul este pregătit pentru deploy pe:
- **GitHub Pages**
- **Vercel**
- **Netlify**

Pentru GitHub Pages:
1. Push pe branch-ul principal
2. `Settings -> Pages`
3. Selectează deploy din branch (root)
