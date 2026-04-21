import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
    buildPersonalizedV3Request,
    fetchPersonalizedV3Horoscope,
    PersonalizedHoroscopeRequestError,
} from "../src/lib/personalized-horoscope";
import {
    HoroscopeApiResponseSchema,
    PersonalizedHoroscopeApiResponseSchema,
} from "../src/lib/validators";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const v2Fixture = JSON.parse(
    readFileSync(join(fixturesDir, "personalized-v2.json"), "utf8")
);
const v3Fixture = JSON.parse(
    readFileSync(join(fixturesDir, "personalized-v3.json"), "utf8")
);

test("fixtures match the generic and personalized contract shapes", () => {
    const v2Parsed = HoroscopeApiResponseSchema.safeParse(v2Fixture);
    const v3Parsed = PersonalizedHoroscopeApiResponseSchema.safeParse(v3Fixture);

    assert.equal(v2Parsed.success, true);
    assert.equal(v3Parsed.success, true);
});

test("buildPersonalizedV3Request includes timezone, locale, and interpretation blocks", () => {
    const payload = buildPersonalizedV3Request({
        birth: {
            date: "1992-08-17",
            time: "14:30",
            location: {
                lat: 48.8566,
                lng: 2.3522,
                city: "Paris",
            },
        },
        date: "2026-04-20",
        timezone: "Europe/Paris",
        locale: "en-US",
    });

    assert.equal(payload.timezone, "Europe/Paris");
    assert.equal(payload.tz_str, "Europe/Paris");
    assert.equal(payload.locale, "en-US");
    assert.equal(payload.include_interpretation_blocks, true);
    assert.deepEqual(payload.birth, {
        year: 1992,
        month: 8,
        day: 17,
        hour: 14,
        minute: 30,
        latitude: 48.8566,
        longitude: 2.3522,
        city: "Paris",
    });
});

test("fetchPersonalizedV3Horoscope retries once on 429 and then resolves parsed data", async () => {
    const waitCalls: number[] = [];
    const responses = [
        new Response(JSON.stringify({ error: "rps_limit_exceeded" }), {
            status: 429,
            headers: { "Retry-After": "1" },
        }),
        new Response(JSON.stringify(v3Fixture), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }),
    ];

    let callCount = 0;
    const result = await fetchPersonalizedV3Horoscope({
        baseUrl: "https://api.freeastroapi.com",
        apiKey: "test-key",
        payload: buildPersonalizedV3Request({
            birth: {
                date: "1992-08-17",
                time: "14:30",
                location: {
                    lat: 48.8566,
                    lng: 2.3522,
                    city: "Paris",
                },
            },
            date: "2026-04-20",
            timezone: "Europe/Paris",
            locale: "en-US",
        }),
        fetchImpl: async (input) => {
            callCount += 1;
            assert.equal(
                input,
                "https://api.freeastroapi.com/api/v3/horoscope/daily/personal"
            );
            return responses.shift() as Response;
        },
        wait: async (ms) => {
            waitCalls.push(ms);
        },
    });

    assert.equal(callCount, 2);
    assert.deepEqual(waitCalls, [1000]);
    assert.equal(result.meta.settings.version, "v3");
    assert.equal(result.data.personal?.next_shift?.label, "Mars Sextile Natal Saturn starts");
});

test("fetchPersonalizedV3Horoscope surfaces a friendly throttle error after a second 429", async () => {
    await assert.rejects(
        () =>
            fetchPersonalizedV3Horoscope({
                baseUrl: "https://api.freeastroapi.com",
                payload: buildPersonalizedV3Request({
                    birth: {
                        date: "1992-08-17",
                        time: "14:30",
                        location: {
                            lat: 48.8566,
                            lng: 2.3522,
                            city: "Paris",
                        },
                    },
                    date: "2026-04-20",
                    timezone: "Europe/Paris",
                    locale: "en-US",
                }),
                fetchImpl: async () =>
                    new Response(JSON.stringify({ error: "rps_limit_exceeded" }), {
                        status: 429,
                        headers: { "Retry-After": "1" },
                    }),
                wait: async () => {},
            }),
        (error: unknown) => {
            assert.ok(error instanceof PersonalizedHoroscopeRequestError);
            assert.equal(error.status, 429);
            assert.match(error.userMessage, /temporarily busy/i);
            return true;
        }
    );
});
