import type { HoroscopeData } from "./validators";

export interface BirthDetails {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    lat: number;
    lon: number;
    tzone: number;
    city: string;
}

export interface FetchHoroscopeParams {
    sign?: string;
    date?: string;
    birth?: BirthDetails;
}

export interface HoroscopeResult {
    data: HoroscopeData;
    error?: never;
}

export interface HoroscopeError {
    data?: never;
    error: string;
    status?: number;
}

export type HoroscopeResponse = HoroscopeResult | HoroscopeError;

/**
 * Client-side fetch helper that calls our Next.js API route,
 * which proxies to FreeAstroAPI securely.
 */
export async function fetchHoroscope(
    params: FetchHoroscopeParams
): Promise<HoroscopeResponse> {
    try {
        const isPersonalized = !!params.birth;
        let url = `/api/horoscope`;
        let body = undefined;

        if (isPersonalized && params.birth) {
            const { year, month, day, hour, minute, lat, lon, city } = params.birth;
            const birthDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const birthTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

            body = JSON.stringify({
                birth: {
                    date: birthDate,
                    time: birthTime,
                    location: { lat, lng: lon, city }
                },
                date: params.date || "today"
            });
        } else {
            const searchParams = new URLSearchParams();
            if (params.sign) searchParams.set("sign", params.sign.toLowerCase());
            if (params.date) searchParams.set("date", params.date);
            url += `?${searchParams.toString()}`;
        }

        const method = isPersonalized ? "POST" : "GET";
        console.log("[fetchHoroscope] Request:", { isPersonalized, method, url, body });

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: body
        });

        const json = await res.json();

        if (!res.ok) {
            return {
                error: json.error || "Failed to load horoscope.",
                status: res.status,
            };
        }

        return { data: json.data };
    } catch {
        return { error: "Network error. Please check your connection and try again." };
    }
}
