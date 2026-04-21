import type {
    PersonalizedActiveWindow,
    PersonalizedDominantTopic,
    PersonalizedExactHit,
    PersonalizedHoroscopeData,
    PersonalizedNextShift,
    PersonalizedSupportiveVsChallenging,
    PersonalizedTransit,
} from "./validators";

function asExplanationText(explanation: PersonalizedTransit["explanation"]): string | null {
    if (!explanation) {
        return null;
    }

    if (typeof explanation === "string") {
        return explanation;
    }

    return explanation.main;
}

export function getPrimaryTransit(
    data: PersonalizedHoroscopeData
): PersonalizedTransit | undefined {
    return data.personal?.transits_top?.[0];
}

export function buildPersonalizedSummary(
    data: PersonalizedHoroscopeData
): string {
    const contentText = data.content.text?.trim();
    if (contentText) {
        return contentText;
    }

    const primaryTransitText = asExplanationText(getPrimaryTransit(data)?.explanation);
    if (primaryTransitText) {
        return primaryTransitText;
    }

    const focusAreas = data.personal?.focus_areas?.slice(0, 2).join(" and ");
    const dominantTopic = getDominantTopics(data)[0]?.title;
    const nextShift = getNextShift(data)?.label;
    const clauses = [focusAreas, dominantTopic, nextShift].filter(Boolean);

    if (clauses.length > 0) {
        return `Today's personalized reading centers on ${clauses.join(", with attention on ")}.`;
    }

    return "No long-form summary returned; showing live transit context instead.";
}

export function getTimelineNote(data: PersonalizedHoroscopeData): string | null {
    if (data.content.text?.trim()) {
        return null;
    }

    return "No long-form summary returned; showing live transit context instead.";
}

export function getSupportingVsChallenging(
    data: PersonalizedHoroscopeData
): PersonalizedSupportiveVsChallenging | undefined {
    return (
        data.personal?.supportive_vs_challenging ||
        data.personal?.day_context?.supportive_vs_challenging
    );
}

export function getDominantTopics(
    data: PersonalizedHoroscopeData
): PersonalizedDominantTopic[] {
    return (
        data.personal?.dominant_topics ||
        data.personal?.day_context?.dominant_topics ||
        []
    );
}

export function getNextShift(
    data: PersonalizedHoroscopeData
): PersonalizedNextShift | undefined {
    return data.personal?.next_shift || data.personal?.day_context?.next_shift;
}

export function getExactHits(
    data: PersonalizedHoroscopeData
): PersonalizedExactHit[] {
    return data.personal?.exact_hits || data.personal?.day_context?.exact_hits || [];
}

export function getActiveWindows(
    data: PersonalizedHoroscopeData
): PersonalizedActiveWindow[] {
    return (
        data.personal?.active_windows ||
        data.personal?.day_context?.active_windows ||
        []
    );
}

export function getTransitSupportPoints(
    transit: PersonalizedTransit | undefined
): string[] {
    if (!transit?.explanation || typeof transit.explanation === "string") {
        return [];
    }

    return transit.explanation.supporting || [];
}

export function getFallbackGuidance(data: PersonalizedHoroscopeData): string[] {
    if (data.content.do?.length || data.content.dont?.length) {
        return [];
    }

    const points = data.personal?.transits_top?.flatMap((transit) =>
        getTransitSupportPoints(transit)
    ) || [];

    return points.slice(0, 4);
}

export function getTransitMainText(transit: PersonalizedTransit): string {
    return (
        asExplanationText(transit.explanation) ||
        transit.label ||
        `${transit.transit_planet.label} ${transit.aspect.label} ${transit.natal_planet.label}`
    );
}

function normalizeTimelineLabel(label: string): string {
    return label
        .toLowerCase()
        .replace(/\b(starts|start|ends|end|exact)\b/g, " ")
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function findTransitByLabel(
    data: PersonalizedHoroscopeData,
    label?: string
): PersonalizedTransit | undefined {
    if (!label) {
        return undefined;
    }

    const normalizedTarget = normalizeTimelineLabel(label);
    const transits = data.personal?.transits_top || [];

    return transits.find((transit) => {
        const transitLabel = transit.label || `${transit.transit_planet.label} ${transit.aspect.label} Natal ${transit.natal_planet.label}`;
        const normalizedTransit = normalizeTimelineLabel(transitLabel);

        return (
            normalizedTransit === normalizedTarget ||
            normalizedTransit.includes(normalizedTarget) ||
            normalizedTarget.includes(normalizedTransit)
        );
    });
}

function buildGenericTimelineInterpretation(label: string): string {
    const cleanedLabel = label.replace(/\b(starts|start|ends|end|exact)\b/gi, "").replace(/\s+/g, " ").trim();
    const match = cleanedLabel.match(/^(.+?)\s+(Conjunction|Opposition|Square|Trine|Sextile)\s+Natal\s+(.+)$/i);

    if (!match) {
        return `${cleanedLabel} is active in the timeline now, so keep an eye on the mood and decisions that gather around this theme.`;
    }

    const [, transitPlanet, aspect, natalPoint] = match;
    const aspectKey = aspect.toLowerCase();
    const aspectTone: Record<string, string> = {
        conjunction: "merges forces with",
        opposition: "creates a visible tension against",
        square: "puts pressure on",
        trine: "flows easily toward",
        sextile: "opens a workable opportunity with",
    };

    return `${transitPlanet} ${aspectTone[aspectKey] || "activates"} your natal ${natalPoint}, making this a useful moment to notice how that theme is shaping the day and respond with intention.`;
}

export function getTimelineInterpretation(
    data: PersonalizedHoroscopeData,
    label?: string
): string | null {
    if (!label) {
        return null;
    }

    const transit = findTransitByLabel(data, label);
    if (!transit) {
        return buildGenericTimelineInterpretation(label);
    }

    return getTransitMainText(transit) || buildGenericTimelineInterpretation(label);
}

export function getMatchedTimelineInterpretation(
    data: PersonalizedHoroscopeData,
    label?: string
): string | null {
    const transit = findTransitByLabel(data, label);

    if (!transit) {
        return null;
    }

    return getTransitMainText(transit);
}

export function getTransitStatus(
    transit: PersonalizedTransit,
    now: Date = new Date()
): string {
    if (transit.exact_at) {
        const diffMs = new Date(transit.exact_at).getTime() - now.getTime();
        if (diffMs > 0 && diffMs <= 36 * 60 * 60 * 1000) {
            return "Exact soon";
        }
        if (diffMs < 0) {
            return "Separating";
        }
    }

    if (transit.is_applying === true) {
        return "Applying now";
    }

    if (transit.is_applying === false) {
        return "Separating";
    }

    return "Active influence";
}

export function formatZonedDateTime(
    value: string,
    timezone: string,
    locale = "en"
): string {
    return new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(value));
}

export function formatWindowRange(
    start: string,
    end: string,
    timezone: string,
    locale = "en"
): string {
    const dateFormatter = new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        month: "short",
        day: "numeric",
    });
    const timeFormatter = new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        hour: "numeric",
        minute: "2-digit",
    });

    const startDate = new Date(start);
    const endDate = new Date(end);
    const sameDay = dateFormatter.format(startDate) === dateFormatter.format(endDate);

    if (sameDay) {
        return `${dateFormatter.format(startDate)} • ${timeFormatter.format(startDate)} - ${timeFormatter.format(endDate)}`;
    }

    return `${dateFormatter.format(startDate)} ${timeFormatter.format(startDate)} - ${dateFormatter.format(endDate)} ${timeFormatter.format(endDate)}`;
}
