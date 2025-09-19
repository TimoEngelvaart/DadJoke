module.exports = async function (context, req) {
  const format = (req.query.format || "json").toLowerCase();

  try {
    // Free, no-key Dad Joke API
    const resp = await fetch("https://icanhazdadjoke.com/", {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Azure-Function-Demo"
      }
    });

    if (!resp.ok) throw new Error(`Upstream ${resp.status}`);
    const data = await resp.json(); // { id, joke, status }

    if (format === "text" || format === "html") {
      // Return styled HTML page
      const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>🤣 Dad Joke</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 3rem; max-width: 60ch; }
    blockquote { font-size: 1.6rem; }
  </style>
</head>
<body>
  <h1>🤣 Dad Joke</h1>
  <blockquote>${data.joke}</blockquote>
</body>
</html>`;

      context.res = {
        status: 200,
        headers: { "Content-Type": "text/html" },
        body: html
      };
    } else {
      // Default JSON response
      context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: { joke: data.joke }
      };
    }
  } catch (err) {
    context.log.error(err);
    context.res = {
      status: 502,
      headers: { "Content-Type": "application/json" },
      body: { error: "Could not fetch a joke.", detail: String(err) }
    };
  }
};
