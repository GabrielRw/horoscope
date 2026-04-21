import { NextRequest, NextResponse } from "next/server";
import { isValidSign } from "@/lib/signs";
import {
    buildPersonalizedV3Request,
    fetchPersonalizedV3Horoscope,
    PersonalizedHoroscopeRequestError,
} from "@/lib/personalized-horoscope";
import { HoroscopeApiResponseSchema } from "@/lib/validators";

const FREEASTROAPI_BASE_URL =
    process.env.FREEASTROAPI_BASE_URL || "https://astro-api-1qnc.onrender.com";
const FREEASTROAPI_V3_BASE_URL =
    process.env.FREEASTROAPI_V3_BASE_URL || "https://api.freeastroapi.com";
const API_KEY = process.env.FREEASTROAPI_API_KEY || "";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const sign = searchParams.get("sign")?.toLowerCase();
    const date = searchParams.get("date") || "today";

    if (!sign || !isValidSign(sign)) {
        return NextResponse.json(
            { error: `Invalid sign: "${sign}". Must be one of the 12 zodiac signs.` },
            { status: 400 }
        );
    }

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
            next: { revalidate: 3600 },
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
        const parsed = HoroscopeApiResponseSchema.safeParse(raw);

        if (!parsed.success) {
            console.error(
                "[FreeAstroAPI] Schema validation failed:",
                parsed.error.issues,
                "Raw data:",
                JSON.stringify(raw)
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
        const { birth, date, timezone, tz_str, locale } = body;

        if (!birth || !birth.date || !birth.time || !birth.location) {
            return NextResponse.json(
                { error: "Missing birth details" },
                { status: 400 }
            );
        }

        const payload = buildPersonalizedV3Request({
            birth,
            date,
            timezone,
            tzStr: tz_str,
            locale,
        });

        const data = await fetchPersonalizedV3Horoscope({
            baseUrl: FREEASTROAPI_V3_BASE_URL,
            apiKey: API_KEY,
            payload,
        });

        return NextResponse.json(data, {
            status: 200,
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            },
        });
    } catch (err) {
        if (err instanceof PersonalizedHoroscopeRequestError) {
            console.error("[FreeAstroAPI] Personalized POST error:", err.status, err.message);
            return NextResponse.json(
                { error: err.userMessage },
                { status: err.status }
            );
        }

        console.error("[FreeAstroAPI] POST error:", err);
        return NextResponse.json(
            { error: "We couldn't process your request. Try again." },
            { status: 500 }
        );
    }
}
