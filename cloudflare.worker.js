export default {
  async fetch(request) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "https://skillscan.sh",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const filePath = url.pathname.replace(/^\/raw_code\//, ''); 

    if (!filePath) {
      return new Response(
        "Provide a file path, e.g. /src/skillscan/analysis.py",
        { status: 400 }
      );
    }

    // Decode and normalize the path, then check for traversal
    const decoded = decodeURIComponent(filePath);
    if (decoded.includes("..") || decoded.includes("//") || decoded.includes("\\")) {
      return new Response("Invalid path", { status: 400 });
    }

    // Allowlist: only serve files from known source directories
    const allowedPrefixes = ["src/", "docs/", "tests/", "rules/", "README", "LICENSE", "CONTRIBUTING", "CHANGELOG"];
    if (!allowedPrefixes.some(p => decoded.startsWith(p))) {
      return new Response("Path not allowed", { status: 403 });
    }

    const rawUrl = `https://raw.githubusercontent.com/kurtpayne/skillscan-security/main/${decoded}`;

    let response;
    try {
      response = await fetch(rawUrl, {
        headers: { "User-Agent": "skillscan-proxy/1.0" },
      });
    } catch (e) {
      return new Response(`Fetch failed: ${e.message}`, { status: 502 });
    }

    if (!response.ok) {
      return new Response(
        `Not found: ${decoded} (status ${response.status})`,
        { status: response.status }
      );
    }

    const text = await response.text();

    return new Response(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "https://skillscan.sh",
        "Cache-Control": "public, max-age=300",
      },
    });
  },
};
