export default {
  async fetch(request) {
    const url = new URL(request.url);
    const filePath = url.pathname.replace(/^\/raw_code\//, ''); 

    if (!filePath) {
      return new Response(
        "Provide a file path, e.g. /src/skillscan/analysis.py",
        { status: 400 }
      );
    }

    if (filePath.includes("..") || filePath.includes("//")) {
      return new Response("Invalid path", { status: 400 });
    }

    const rawUrl = `https://raw.githubusercontent.com/kurtpayne/skillscan-security/main/${filePath}`;

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
        `Not found: ${filePath} (status ${response.status})`,
        { status: response.status }
      );
    }

    const text = await response.text();

    return new Response(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
    });
  },
};
