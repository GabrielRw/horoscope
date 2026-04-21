import type { HoroscopeData, PersonalizedHoroscopeData } from "./validators";

export interface BirthDetails {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    lat: number;
    lon: number;
    tzone: string;
    city: string;
}

interface SignFetchHoroscopeParams {
    sign: string;
    date?: string;
    birth?: never;
    locale?: never;
}

interface PersonalizedFetchHoroscopeParams {
    birth: BirthDetails;
    date?: string;
    sign?: never;
    locale?: string;
}

export type FetchHoroscopeParams =
    | SignFetchHoroscopeParams
    | PersonalizedFetchHoroscopeParams;

export interface HoroscopeResult {
    data: HoroscopeData;
    error?: never;
}

export interface PersonalizedHoroscopeResult {
    data: PersonalizedHoroscopeData;
    error?: never;
}

export interface HoroscopeError {
    data?: never;
    error: string;
    status?: number;
}

export type SignHoroscopeResponse = HoroscopeResult | HoroscopeError;
export type PersonalizedHoroscopeResponse =
    | PersonalizedHoroscopeResult
    | HoroscopeError;

function resolveLocale(explicitLocale?: string): string {
    if (explicitLocale) {
        return explicitLocale;
    }

    if (typeof navigator !== "undefined" && navigator.language) {
        return navigator.language;
    }

    return "en";
}

export async function fetchHoroscope(
    params: PersonalizedFetchHoroscopeParams
): Promise<PersonalizedHoroscopeResponse>;
export async function fetchHoroscope(
    params: SignFetchHoroscopeParams
): Promise<SignHoroscopeResponse>;
export async function fetchHoroscope(
    params: FetchHoroscopeParams
): Promise<SignHoroscopeResponse | PersonalizedHoroscopeResponse> {
    try {
        const isPersonalized = "birth" in params && !!params.birth;
        let url = "/api/horoscope";
        let body: string | undefined;

        if (isPersonalized && params.birth) {
            const { year, month, day, hour, minute, lat, lon, city, tzone } = params.birth;
            const birthDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const birthTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

            body = JSON.stringify({
                birth: {
                    date: birthDate,
                    time: birthTime,
                    location: { lat, lng: lon, city },
                },
                date: params.date || "today",
                timezone: tzone || "UTC",
                tz_str: tzone || "UTC",
                locale: resolveLocale(params.locale),
                include_interpretation_blocks: true,
            });
        } else if ("sign" in params) {
            const searchParams = new URLSearchParams();
            if (params.sign) searchParams.set("sign", params.sign.toLowerCase());
            if (params.date) searchParams.set("date", params.date);
            url += `?${searchParams.toString()}`;
        }

        const method = isPersonalized ? "POST" : "GET";

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body,
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
