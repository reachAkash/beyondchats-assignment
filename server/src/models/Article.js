const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    publishedAt: Date,
    content: String,
    updatedContent: String,
    references: [String],
    status: {
      type: String,
      enum: ["SCRAPED", "GENERATED"],
      default: "SCRAPED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
