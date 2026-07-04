export async function apiFetch(path, options = {}) {
  const isServer = typeof window === "undefined";
  
  // In production SSR, use the configured API_URL; otherwise default to localhost:5000
  let apiTarget = "http://localhost:5000";
  if (typeof process !== "undefined" && process.env.API_URL) {
    apiTarget = process.env.API_URL;
  }
  
  const baseUrl = isServer ? apiTarget : "";
  
  const headers = { ...options.headers };
  if (typeof window !== "undefined" && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  } else if (typeof window === "undefined") {
    headers["Content-Type"] = "application/json";
  }
  
  if (isServer) {
    try {
      const serverPkg = "@tanstack/react-start/server";
      const { getRequestHeader } = await import(/* @vite-ignore */ serverPkg);
      const cookie = getRequestHeader("cookie");
      if (cookie) {
        headers["cookie"] = cookie;
      }
    } catch (e) {
      console.warn("Could not import React Start server utilities on SSR", e);
    }
  } else {
    // On the client, always send credentials (cookies) in fetch
    options.credentials = "include";
  }
  
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${res.status}`);
  }
  
  return res.json().catch(() => ({}));
}
