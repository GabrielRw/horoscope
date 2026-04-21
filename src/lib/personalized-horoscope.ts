import {
    PersonalizedHoroscopeApiResponseSchema,
    type PersonalizedHoroscopeApiResponse,
} from "./validators";

export interface PersonalizedBirthInput {
    date: string;
    time: string;
    location: {
        lat: number;
        lng: number;
        city: string;
    };
}

export interface PersonalizedV3RequestInput {
    birth: PersonalizedBirthInput;
    date?: string;
    timezone?: string;
    tzStr?: string;
    locale?: string;
}

export interface PersonalizedV3RequestBody {
    birth: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        latitude: number;
        longitude: number;
        city: string;
    };
    date: string;
    timezone: string;
    tz_str: string;
    locale: string;
    include_interpretation_blocks: boolean;
}

export class PersonalizedHoroscopeRequestError extends Error {
    status: number;
    userMessage: string;

    constructor(status: number, userMessage: string, message?: string) {
        super(message || userMessage);
        this.name = "PersonalizedHoroscopeRequestError";
        this.status = status;
        this.userMessage = userMessage;
    }
}

export function resolveTargetDate(date?: string): string {
    if (!date || date === "today") {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    }
    return date;
}

export function buildPersonalizedV3Request(
    input: PersonalizedV3RequestInput
): PersonalizedV3RequestBody {
    const birthDate = new Date(input.birth.date);
    const [hour, minute] = input.birth.time.split(":").map(Number);
    const timezone = input.tzStr || input.timezone || "UTC";

    return {
        birth: {
            year: birthDate.getFullYear(),
            month: birthDate.getMonth() + 1,
            day: birthDate.getDate(),
            hour,
            minute,
            latitude: input.birth.location.lat,
            longitude: input.birth.location.lng,
            city: input.birth.location.city,
        },
        date: resolveTargetDate(input.date),
        timezone,
        tz_str: timezone,
        locale: input.locale || "en",
        include_interpretation_blocks: true,
    };
}

function getRetryAfterMs(retryAfterHeader: string | null): number {
    if (!retryAfterHeader) {
        return 1000;
    }

    const asSeconds = Number(retryAfterHeader);
    if (!Number.isNaN(asSeconds)) {
        return Math.max(0, asSeconds * 1000);
    }

    const asDate = Date.parse(retryAfterHeader);
    if (!Number.isNaN(asDate)) {
        return Math.max(0, asDate - Date.now());
    }

    return 1000;
}

export async function fetchPersonalizedV3Horoscope({
    baseUrl,
    apiKey,
    payload,
    fetchImpl = fetch,
    wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
}: {
    baseUrl: string;
    apiKey?: string;
    payload: PersonalizedV3RequestBody;
    fetchImpl?: typeof fetch;
    wait?: (ms: number) => Promise<void>;
}): Promise<PersonalizedHoroscopeApiResponse> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (apiKey) {
        headers["x-api-key"] = apiKey;
    }

    const url = `${baseUrl.replace(/\/$/, "")}/api/v3/horoscope/daily/personal`;

    for (let attempt = 0; attempt < 2; attempt += 1) {
        const response = await fetchImpl(url, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
            next: { revalidate: 0 },
        });

        if (response.ok) {
            const raw = await response.json();
            const parsed = PersonalizedHoroscopeApiResponseSchema.safeParse(raw);

            if (!parsed.success) {
                throw new PersonalizedHoroscopeRequestError(
                    502,
                    "The horoscope provider changed their response. Please try again later.",
                    parsed.error.message
                );
            }

            return parsed.data;
        }

        if (response.status === 429) {
            if (attempt === 0) {
                await wait(getRetryAfterMs(response.headers.get("Retry-After")));
                continue;
            }

            throw new PersonalizedHoroscopeRequestError(
                429,
                "The horoscope provider is temporarily busy. Please retry in a moment.",
                await response.text()
            );
        }

        const errorText = await response.text();
        throw new PersonalizedHoroscopeRequestError(
            response.status,
            "We couldn't process your request. Try again.",
            errorText
        );
    }

    throw new PersonalizedHoroscopeRequestError(
        500,
        "We couldn't process your request. Try again."
    );
}
