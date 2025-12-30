require("dotenv").config();
const axios = require("axios");

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const CX = process.env.GOOGLE_CX;

async function searchGoogle(query) {
  const res = await axios.get("https://www.googleapis.com/customsearch/v1", {
    params: {
      key: GOOGLE_API_KEY,
      cx: CX,
      q: query,
    },
  });

  return res.data.items
    .map((item) => item.link)
    .filter(
      (link) =>
        !link.includes("beyondchats.com") &&
        !link.includes("youtube") &&
        !link.includes("pdf")
    )
    .slice(0, 4); // take more, filter later
}

module.exports = { searchGoogle };
