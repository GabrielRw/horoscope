import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PersonalizedReading } from "../src/components/PersonalizedReading";
import {
    buildPersonalizedSummary,
    findTransitByLabel,
    formatZonedDateTime,
    getFallbackGuidance,
    getTimelineInterpretation,
    getTransitStatus,
} from "../src/lib/personalized-reading";
import type {
    HoroscopeApiResponse,
    PersonalizedHoroscopeApiResponse,
} from "../src/lib/validators";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const v2Fixture = JSON.parse(
    readFileSync(join(fixturesDir, "personalized-v2.json"), "utf8")
) as HoroscopeApiResponse;
const v3Fixture = JSON.parse(
    readFileSync(join(fixturesDir, "personalized-v3.json"), "utf8")
) as PersonalizedHoroscopeApiResponse;

test("buildPersonalizedSummary prefers content text and falls back to the top transit explanation", () => {
    assert.match(
        buildPersonalizedSummary(v2Fixture.data as unknown as PersonalizedHoroscopeApiResponse["data"]),
        /feelings and will align/i
    );
    assert.match(buildPersonalizedSummary(v3Fixture.data), /thoughts and feelings sit close together/i);
});

test("getFallbackGuidance pulls supporting bullets when do/dont are absent", () => {
    const guidance = getFallbackGuidance(v3Fixture.data);
    assert.equal(guidance.length, 4);
    assert.match(guidance[0], /simple sentences/i);
});

test("getTransitStatus labels upcoming exact hits as exact soon", () => {
    const status = getTransitStatus(v3Fixture.data.personal!.transits_top[0], new Date("2026-04-20T13:00:00Z"));
    assert.equal(status, "Exact soon");
});

test("timeline labels resolve back to transit interpretations", () => {
    const matchedWindowTransit = findTransitByLabel(v3Fixture.data, "Mercury Conjunction Natal Moon");
    const nextShiftInterpretation = getTimelineInterpretation(
        v3Fixture.data,
        "Mars Sextile Natal Saturn starts"
    );

    assert.equal(matchedWindowTransit?.label, "Mercury Conjunction Natal Moon");
    assert.match(nextShiftInterpretation || "", /Mars .* natal Saturn/i);
});

test("PersonalizedReading renders the long-form summary when v2 text is present", () => {
    const html = renderToStaticMarkup(
        <PersonalizedReading
            data={v2Fixture.data as unknown as PersonalizedHoroscopeApiResponse["data"]}
            timezone="Europe/Paris"
            locale="en-US"
        />
    );

    assert.match(html, /feelings and will align in a cooperative way/i);
    assert.doesNotMatch(html, /No long-form summary returned/i);
});

test("PersonalizedReading renders timeline messaging and localized exact times when v3 text is absent", () => {
    const expectedTimestamp = formatZonedDateTime(
        "2026-04-21T14:37:30Z",
        "Europe/Paris",
        "en-US"
    );
    const html = renderToStaticMarkup(
        <PersonalizedReading
            data={v3Fixture.data}
            timezone="Europe/Paris"
            locale="en-US"
        />
    );

    assert.match(html, /No long-form summary returned; showing live transit context instead\./i);
    assert.match(html, /Mercury Conjunction Natal Moon/i);
    assert.match(html, /When this influence is active, thoughts and feelings sit close together/i);
    assert.match(html, /Transit windows currently shaping the background of the day/i);
    assert.match(html, new RegExp(expectedTimestamp.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.doesNotMatch(html, /Transit Deep-Dive/i);
});
