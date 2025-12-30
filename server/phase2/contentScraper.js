const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeArticle(url) {
  const { data } = await axios.get(url, { timeout: 10000 });
  const $ = cheerio.load(data);

  let content = "";

  if ($("article").length) {
    content = $("article").text();
  } else if ($("main").length) {
    content = $("main").text();
  } else {
    let maxText = "";
    $("div").each((_, el) => {
      const text = $(el).text();
      if (text.length > maxText.length) maxText = text;
    });
    content = maxText;
  }

  return content.replace(/\s+/g, " ").trim();
}

module.exports = { scrapeArticle };
