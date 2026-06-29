import { NextResponse } from "next/server";

export function middleware(request) {
  // Retrieve the origin of the request
  const origin = request.headers.get("origin") || "*";

  // Create a response object
  const response = NextResponse.next();

  // Add the CORS headers to the response
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-total-count, content-range");
  response.headers.set("Access-Control-Expose-Headers", "x-total-count, content-range");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  // Handle OPTIONS request pre-flight
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: response.headers,
    });
  }

  return response;
}

// Apply the middleware only to API routes
export const config = {
  matcher: "/api/:path*",
};
