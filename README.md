# BeyondChats Blog Automation Project

This project automates blog content enhancement using web scraping, Google search, and LLM-based rewriting.  
It is divided into **three phases**: backend scraping & APIs, automated content enhancement, and a React-based frontend UI.

---

## 🧩 Project Overview

### Phase 1 – Backend & Scraping

- Scrapes the **5 oldest articles** from the BeyondChats blog.
- Stores articles in a database.
- Exposes **CRUD APIs** to manage articles.

### Phase 2 – Content Enrichment Pipeline

- Fetches articles via Phase-1 APIs.
- Searches article titles on Google.
- Scrapes ranking external articles.
- Uses an LLM to rewrite and enhance original content.
- Publishes updated articles via APIs.
- Stores reference links used for rewriting.

### Phase 3 – Frontend UI

- React + TypeScript frontend.
- Displays original and updated articles.
- Responsive, clean, professional UI.

---

## 🛠 Tech Stack

### Backend

- Node.js
- Express
- MongoDB
- Axios
- Cheerio (scraping)
- Google Search API
- LLM API (Gemini)

### Frontend

- React (Vite)
- TypeScript
- React Router
- Axios
- CSS (custom, no UI library)

---

## 📁 Project Structure

```txt
beyondchats-assessment/
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── scrapers/
│   ├── services/
│   ├── src/
│   ├── index.js
│   ├── package.json
│   └── .env
│
├── server/phase2/
│   ├── googleSearch.js
│   ├── contentScraper.js
│   ├── llm.service.js
│   └── runPhase2.js
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── pages/
│   │   ├── types/
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
└── README.md
```

## 🔐 Environment Variables Setup

Create a .env file inside the server/ directory and add the following variables:

```txt
PORT=8000

MONGO_URI=your_mongodb_connection_string

LLM_PROVIDER=gemini

GEMINI_API_KEY=your_gemini_api_key

GOOGLE_CX=your_google_custom_search_id

GOOGLE_API_KEY=your_google_api_key
```

## ⚙️ Backend Setup (Phase 1)

Navigate to the backend directory and install dependencies:

```txt
cd server
npm install
npm start
```

The backend will run on:

http://localhost:8000

This service:

- Scrapes articles from BeyondChats

- Stores them in MongoDB

- Exposes CRUD APIs for articles

## 🤖 Phase 2 Automation Script Setup

- The Phase 2 script uses the same .env file inside server/.

- Run the automation script from the server/ directory:

```txt
node phase2/runPhase2.js
```

This script will:

- Fetch scraped articles via backend APIs

- Search article titles on Google

- Scrape external ranking articles

- Rewrite content using the configured LLM provider(Gemini)

- Update articles and store reference links

### Note: Some external websites may block scraping (403/500). In such cases, the system proceeds with available valid sources to avoid pipeline failure.

## 🖥 Frontend Setup (Phase 3)

Navigate to the frontend directory:

```txt
cd client
npm install
npm run dev
```

The frontend will be available at:

http://localhost:5173

## ⚠️ Known Limitations

- Some websites may block scraping attempts (403/500 errors)
- Scraping success depends on target website structure and anti-bot measures

## 🤝 Contribution

This is a assignment project, made by Akash
