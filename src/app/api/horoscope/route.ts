import { NextRequest, NextResponse } from "next/server";
import { isValidSign } from "@/lib/signs";
import { HoroscopeApiResponseSchema } from "@/lib/validators";

const FREEASTROAPI_BASE_URL =
    process.env.FREEASTROAPI_BASE_URL || "https://astro-api-1qnc.onrender.com";
const API_KEY = process.env.FREEASTROAPI_API_KEY || "";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const sign = searchParams.get("sign")?.toLowerCase();
    const date = searchParams.get("date") || "today";

    // Validate sign
    if (!sign || !isValidSign(sign)) {
        return NextResponse.json(
            { error: `Invalid sign: "${sign}". Must be one of the 12 zodiac signs.` },
            { status: 400 }
        );
    }

    // Validate date format
    if (date !== "today" && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json(
            { error: `Invalid date format: "${date}". Use YYYY-MM-DD or "today".` },
            { status: 400 }
        );
    }

    const params = new URLSearchParams({
        sign,
        date,
    });

    // Use V2 endpoint
    const url = `${FREEASTROAPI_BASE_URL}/api/v2/horoscope/daily/sign?${params.toString()}`;

    try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if (API_KEY) {
            headers["x-api-key"] = API_KEY;
        }

        const apiRes = await fetch(url, {
            method: "GET",
            headers,
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!apiRes.ok) {
            const errorText = await apiRes.text();
            console.error("[FreeAstroAPI] Error response:", apiRes.status, errorText);
            return NextResponse.json(
                { error: "We couldn't load today's reading. Try again." },
                { status: apiRes.status }
            );
        }

        const raw = await apiRes.json();

        // Validate response schema with zod
        const parsed = HoroscopeApiResponseSchema.safeParse(raw);

        if (!parsed.success) {
            console.error(
                "[FreeAstroAPI] Schema validation failed:",
                parsed.error.issues
            );
            return NextResponse.json(
                { error: "API schema has changed. Please check back later." },
                { status: 502 }
            );
        }

        return NextResponse.json(
            { data: parsed.data.data, meta: parsed.data.meta },
            {
                status: 200,
                headers: {
                    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
                },
            }
        );

    } catch (err) {
        console.error("[FreeAstroAPI] Fetch error:", err);
        return NextResponse.json(
            { error: "We couldn't load today's reading. Try again." },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { birth, date } = body;

        if (!birth || !birth.date || !birth.time || !birth.location) {
            return NextResponse.json(
                { error: "Missing birth details" },
                { status: 400 }
            );
        }

        const baseUrl = process.env.FREEASTROAPI_BASE_URL || "https://astro-api-1qnc.onrender.com";
        const apiKey = process.env.FREEASTROAPI_API_KEY || "";

        const birthDate = new Date(birth.date);
        const [hour, minute] = birth.time.split(':').map(Number);

        // Ensure date is YYYY-MM-DD
        let targetDate = date || "today";
        if (targetDate === "today") {
            const now = new Date();
            targetDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        }

        // V2 Payload structure
        const payload = {
            birth: {
                year: birthDate.getFullYear(),
                month: birthDate.getMonth() + 1,
                day: birthDate.getDate(),
                hour: hour,
                minute: minute,
                latitude: birth.location.lat,
                longitude: birth.location.lng,
                city: birth.location.city,
            },
            date: targetDate
        };

        const response = await fetch(`${baseUrl}/api/v2/horoscope/daily/personal`, {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            next: { revalidate: 0 }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[FreeAstroAPI] Error response:", response.status, errorText);
            throw new Error(`API responded with ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json(data, {
            status: 200,
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            }
        });
    } catch (err) {
        console.error("[FreeAstroAPI] POST error:", err);
        return NextResponse.json(
            { error: "We couldn't process your request. Try again." },
            { status: 500 }
        );
    }
}
