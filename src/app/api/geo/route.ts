import { NextRequest, NextResponse } from "next/server";

const FREEASTROAPI_BASE_URL =
    process.env.FREEASTROAPI_BASE_URL || "https://astro-api-1qnc.onrender.com";
const API_KEY = process.env.FREEASTROAPI_API_KEY || "";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q");

    if (!q) {
        return NextResponse.json({ results: [], count: 0 });
    }

    const url = `${FREEASTROAPI_BASE_URL}/api/v1/geo/search?q=${encodeURIComponent(q)}&limit=10`;

    try {
        const headers: Record<string, string> = {};
        if (API_KEY) {
            headers["x-api-key"] = API_KEY;
        }

        const res = await fetch(url, { headers });
        if (!res.ok) {
            throw new Error(`Geo API error: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Geocoding proxy error:", error);
        return NextResponse.json({ error: "Failed to search for cities" }, { status: 500 });
    }
}
