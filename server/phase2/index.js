require("dotenv").config();
const axios = require("axios");
const { searchGoogle } = require("./googleSearch");
const { scrapeArticle } = require("./contentScraper");
const { rewriteArticle } = require("./llm.service");

const PORT = process.env.PORT || 8000;
const API_BASE = `http://localhost:${PORT}/api/articles`;
console.log(API_BASE);

async function runPhase2() {
  const { data: articles } = await axios.get(API_BASE);
  const pending = articles.filter((a) => a.status === "SCRAPED");

  console.log(`Found ${pending.length} articles to process`);

  for (const article of pending) {
    try {
      console.log(`Processing: ${article.title}`);

      // 1️⃣ Search Google
      const links = await searchGoogle(article.title);
      console.log(`Found ${links.length} links`);

      // 2️⃣ Scrape first 2 valid articles
      const contents = [];
      const references = [];

      for (const link of links) {
        try {
          console.log(`Scraping: ${link}`);
          const content = await scrapeArticle(link);

          if (content.length > 500) {
            contents.push(content);
            references.push(link);
            console.log(`✓ Scraped successfully (${content.length} chars)`);
          } else {
            console.log(`✗ Content too short (${content.length} chars)`);
          }
        } catch (scrapeErr) {
          console.log(`✗ Failed to scrape: ${scrapeErr.message}`);
        }

        if (contents.length === 2) break;
      }
      // accept if only one article found
      if (contents.length < 1) {
        console.log(`Skipping: Only found ${contents.length} valid articles`);
        continue;
      }

      // 3️⃣ Rewrite using LLM
      console.log("Rewriting with LLM...");
      const updatedContent = await rewriteArticle(article.title, contents);

      // 4️⃣ Publish via Phase-1 API
      await axios.put(`${API_BASE}/${article._id}`, {
        updatedContent,
        references,
        status: "GENERATED",
      });

      console.log(`✓ Generated: ${article.title}`);
    } catch (err) {
      console.error(`✗ Skipped ${article.title}:`, err.message);
      console.error(err.stack);
    }
  }

  console.log("Phase 2 completed!");
}

runPhase2().catch((err) => {
  console.error("error:", err);
  process.exit(1);
});
