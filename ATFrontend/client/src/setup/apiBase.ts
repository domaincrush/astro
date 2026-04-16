const API_BASE_URL: string = (import.meta as any).env?.VITE_API_URL || "http://localhost:3001";

if (typeof window !== "undefined" && typeof window.fetch === "function") {
  const originalFetch = window.fetch.bind(window);

  window.fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    try {
      const urlString = typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : (input as Request).url;

      if (urlString && urlString.startsWith("/")) {
        const prefixedUrl = `${API_BASE_URL}${urlString}`;

        if (typeof input === "string" || input instanceof URL) {
          return originalFetch(prefixedUrl, init);
        }

        const originalRequest = input as Request;
        const rebuilt = new Request(prefixedUrl, originalRequest);
        return originalFetch(rebuilt, init);
      }
    } catch {}

    return originalFetch(input as any, init);
  };
}

