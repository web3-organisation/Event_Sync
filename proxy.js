import { NextResponse } from "next/server";

export function proxy(request) {
    console.log("PROXY EXECUTED:", request.nextUrl.pathname);

    const response = NextResponse.next();

    response.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
        return new Response(null, { status: 200, headers: response.headers });
    }

    return response;
}

export const config = {
    matcher: "/api/:path*",
};