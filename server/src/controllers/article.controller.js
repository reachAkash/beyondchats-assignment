const Article = require("../models/Article");
const { scrapeOldestArticles } = require("../services/scraper.service");

exports.scrapeAndStore = async (req, res, next) => {
  const scrapedArticles = await scrapeOldestArticles(5);

  let insertedCount = 0;

  for (const article of scrapedArticles) {
    console.log(article.content);
    await Article.updateOne(
      { slug: article.slug },
      {
        $setOnInsert: {
          title: article.title,
          url: article.url,
          slug: article.slug,
          content: article.content || "Dummy content",
          status: "SCRAPED",
        },
      },
      { upsert: true }
    );

    insertedCount++;
  }

  res.status(201).json({
    message: "Articles scraped and stored",
    scraped: scrapedArticles.length,
    attemptedInserts: insertedCount,
  });
};
