const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (!query) return;

  resultsContainer.innerHTML =
    "<p>Searching DreamOon...</p>";

  try {
    const response = await fetch(
      `/api/search?q=${encodeURIComponent(query)}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Search failed");
    }

    if (!data.results.length) {
      resultsContainer.innerHTML =
        "<p>No results found.</p>";
      return;
    }

    resultsContainer.innerHTML = data.results
      .map(result => `
        <article class="result-card">
          <a
            class="result-title"
            href="${escapeHTML(result.url)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${escapeHTML(result.title)}
          </a>

          <div class="result-url">
            ${escapeHTML(result.url)}
          </div>

          <p>
            ${escapeHTML(result.description)}
          </p>
        </article>
      `)
      .join("");

  } catch (error) {
    resultsContainer.innerHTML =
      `<p>DreamOon error: ${escapeHTML(error.message)}</p>`;
  }
});

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
