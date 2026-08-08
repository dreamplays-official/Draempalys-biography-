import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("."));

app.get("/api/search", async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();

    if (!query) {
      return res.status(400).json({
        error: "Search query is required"
      });
    }

    if (!process.env.BRAVE_SEARCH_API_KEY) {
      return res.status(500).json({
        error: "Search API key is not configured"
      });
    }

    const url = new URL(
      "https://api.search.brave.com/res/v1/web/search"
    );

    url.searchParams.set("q", query);
    url.searchParams.set("count", "10");
    url.searchParams.set("safesearch", "moderate");

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "X-Subscription-Token":
          process.env.BRAVE_SEARCH_API_KEY
      }
    });

    if (!response.ok) {
      const errorText = await response.text();

      return res.status(response.status).json({
        error: "Search provider error",
        details: errorText
      });
    }

    const data = await response.json();

    const results = (data.web?.results || []).map(item => ({
      title: item.title || "",
      url: item.url || "",
      description: item.description || ""
    }));

    res.json({
      query,
      results
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "DreamOon search failed"
    });
  }
});

app.listen(PORT, () => {
  console.log(`DreamOon running on port ${PORT}`);
});
