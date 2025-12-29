const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://beyondchats.com/blogs";

async function getLastPageNumber() {
  const { data } = await axios.get(BASE_URL);
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

async function scrapePage(pageNumber) {
  const url =
    pageNumber === 1
      ? BASE_URL
      : `${BASE_URL}/page/${pageNumber}/`;

  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const articles = [];

  $("article").each((_, el) => {
    const titleEl = $(el).find("h2 a");
    const title = titleEl.text().trim();
    const relativeUrl = titleEl.attr("href");

    if (!title || !relativeUrl) return;

    articles.push({
      title,
      url: relativeUrl.startsWith("http")
        ? relativeUrl
        : `https://beyondchats.com${relativeUrl}`,
      slug: relativeUrl.split("/").filter(Boolean).pop()
    });
  });

  return articles;
}

async function scrapeOldestArticles(limit = 5) {
  const lastPage = await getLastPageNumber();
  const collected = [];

  let currentPage = lastPage;

  while (currentPage > 0 && collected.length < limit) {
    const pageArticles = await scrapePage(currentPage);

    // add from the end (older first)
    for (let i = pageArticles.length - 1; i >= 0; i--) {
      collected.push(pageArticles[i]);
      if (collected.length === limit) break;
    }

    currentPage--;
  }

  return collected;
}

const testing = async() =>{
    console.log(await scrapeOldestArticles());
}

testing();

module.exports = { scrapeOldestArticles };
