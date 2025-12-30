const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://beyondchats.com/blogs";

// Find last page number
async function getLastPageNumber() {
  const { data } = await axios.get(BASE_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const $ = cheerio.load(data);
  let lastPage = 1;

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    const match = href && href.match(/\/blogs\/page\/(\d+)\//);
    if (match) {
      lastPage = Math.max(lastPage, Number(match[1]));
    }
  });

  return lastPage;
}

//  Scrape listing page
async function scrapePage(pageNumber) {
  const url = pageNumber === 1 ? BASE_URL : `${BASE_URL}/page/${pageNumber}/`;

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const $ = cheerio.load(data);
  const articles = [];

  $("article").each((_, el) => {
    const titleEl = $(el).find("h2 a");

    const title = titleEl.text().trim();
    const relativeUrl = titleEl.attr("href");

    if (!title || !relativeUrl) return;

    const fullUrl = relativeUrl.startsWith("http")
      ? relativeUrl
      : `https://beyondchats.com${relativeUrl}`;

    articles.push({
      title,
      url: fullUrl,
      slug: relativeUrl.split("/").filter(Boolean).pop(),
    });
  });

  return articles;
}

// Scrape article content
async function scrapeArticleContent(url) {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const $ = cheerio.load(data);

  const contentEl = $("#content");

  if (!contentEl.length) {
    console.warn("❌ #content not found:", url);
    return "";
  }

  // remove junk
  contentEl.find("script, style, nav, footer").remove();

  // clean readable text
  const content = contentEl
    .find("p, h1, h2, h3, h4, li")
    .map((_, el) => $(el).text().trim())
    .get()
    .join("\n\n");

  return content;
}

// Get oldest articles
async function scrapeOldestArticles(limit = 5) {
  const lastPage = await getLastPageNumber();
  const collected = [];

  let currentPage = lastPage;

  while (currentPage > 0 && collected.length < limit) {
    const pageArticles = await scrapePage(currentPage);

    // add from bottom (older first)
    for (let i = pageArticles.length - 1; i >= 0; i--) {
      const article = pageArticles[i];

      article.content = await scrapeArticleContent(article.url);
      collected.push(article);

      if (collected.length === limit) break;
    }

    currentPage--;
  }

  return collected;
}

module.exports = { scrapeOldestArticles };
