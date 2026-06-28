const ORIGIN = process.env.ADMIN_CORS_ORIGIN;

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export function preflight() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function withCors(response) {
  Object.entries(CORS_HEADERS).forEach(([k, v]) =>
    response.headers.set(k, v)
  );
  return response;
}