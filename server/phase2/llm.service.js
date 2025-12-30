require("dotenv").config();
const axios = require("axios");

async function rewriteWithGemini(title, refContents) {
  const prompt = `
You are a professional content writer.
Original article title:
"${title}"

Reference articles content:
${refContents.join("\n\n---\n\n")}

Task:
- Rewrite a high-quality article based on the reference content
- Improve structure and clarity
- Keep originality and avoid plagiarism
- Use professional formatting
- Write in an engaging, informative style
- Aim for 800-1200 words
`;

  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    throw error;
  }
}

async function rewriteArticle(title, refs) {
  if (process.env.LLM_PROVIDER === "gemini") {
    return rewriteWithGemini(title, refs);
  }
  throw new Error("Unsupported LLM provider");
}

module.exports = { rewriteArticle };
