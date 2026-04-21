import { z } from "zod";

const KeyLabelSchema = z.object({
    key: z.string(),
    label: z.string(),
});

const HighlightSchema = z.object({
    type: z.string(),
    key: z.string(),
    label: z.string(),
});

const ScoreDriverSchema = z.object({
    type: z.string(),
    key: z.string(),
    label: z.string().optional(),
    weight: z.number().optional(),
    intensity: z.string().optional(),
    value: z.number().optional(),
    orb_deg: z.number().optional(),
    house: z.number().optional(),
    condition_score: z.number().optional(),
});

const ScoreFactorSchema = z.object({
    dimension: z.string(),
    type: z.string().optional(),
    reason: z.union([
        z.string(),
        z.object({
            main: z.string(),
            secondary: z.string().nullable().optional(),
        }),
    ]),
    drivers: z.array(ScoreDriverSchema).optional(),
});

export const HoroscopeScoresSchema = z.object({
    overall: z.number().optional(),
    love: z.number(),
    career: z.number(),
    money: z.number(),
    health: z.number(),
});

const LuckyTimeWindowSchema = z.object({
    display: z.string(),
    start: z.string(),
    end: z.string(),
    tz: z.string().optional(),
});

export const HoroscopeLuckySchema = z.object({
    color: KeyLabelSchema,
    number: z.number(),
    time_window: z.union([z.string(), LuckyTimeWindowSchema]),
});

const SharedContentFields = {
    theme: z.string(),
    keywords: z.array(z.string()),
    do: z.array(z.string()).optional(),
    dont: z.array(z.string()).optional(),
    supporting_insights: z.array(z.string()).optional(),
};

export const HoroscopeContentSchema = z.object({
    ...SharedContentFields,
    text: z.string(),
});

export const PersonalizedHoroscopeContentSchema = z.object({
    ...SharedContentFields,
    text: z.string().optional(),
});

export const HoroscopeAstroSchema = z.object({
    moon_sign: KeyLabelSchema,
    moon_phase: KeyLabelSchema,
    highlights: z.array(HighlightSchema),
});

const TransitExplanationSchema = z.object({
    main: z.string(),
    supporting: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
});

export const PersonalizedTransitSchema = z.object({
    transit_planet: KeyLabelSchema,
    natal_planet: KeyLabelSchema,
    aspect: KeyLabelSchema,
    label: z.string().optional(),
    orb_deg: z.number().optional(),
    score: z.number(),
    explanation: z.union([z.string(), TransitExplanationSchema]).optional(),
    is_applying: z.boolean().optional(),
    exact_at: z.string().nullable().optional(),
});

const MinimalPersonalSchema = z.object({
    transits_top: z.array(PersonalizedTransitSchema),
    focus_areas: z.array(z.string()).optional(),
    confidence_score: z.number().optional(),
});

export const PersonalizedExactHitSchema = z.object({
    timestamp: z.string(),
    label: z.string(),
    category: z.string().optional(),
    aspect_type: z.string().optional(),
    transit_planet: z.string().optional(),
    natal_point: z.string().optional(),
});

export const PersonalizedActiveWindowSchema = z.object({
    id: z.string(),
    label: z.string(),
    category: z.string().optional(),
    transit_planet: z.string().optional(),
    natal_point: z.string().optional(),
    aspect_type: z.string().optional(),
    pass_type: z.string().optional(),
    start: z.string(),
    end: z.string(),
    exact_hits: z.array(z.string()).optional(),
});

export const PersonalizedDominantTopicSchema = z.object({
    title: z.string(),
    category: z.string().optional(),
    focus_type: z.string().optional(),
    score: z.number().optional(),
    peak_datetime: z.string().optional(),
});

export const PersonalizedNextShiftSchema = z.object({
    timestamp: z.string(),
    label: z.string(),
    type: z.string().optional(),
});

export const PersonalizedSupportiveVsChallengingSchema = z.object({
    supportive: z.number(),
    challenging: z.number(),
});

export const PersonalizedInsightsMetaSchema = z.object({
    source: z.string().optional(),
    timeline_enabled: z.boolean().optional(),
    insights_enabled: z.boolean().optional(),
    interpretation_blocks_enabled: z.boolean().optional(),
    timeline_pass_count: z.number().optional(),
    generated_fact_count: z.number().optional(),
    range_start: z.string().optional(),
    range_end: z.string().optional(),
});

export const PersonalizedDayContextSchema = z.object({
    active_windows: z.array(PersonalizedActiveWindowSchema).optional(),
    exact_hits: z.array(PersonalizedExactHitSchema).optional(),
    next_shift: PersonalizedNextShiftSchema.optional(),
    dominant_topics: z.array(PersonalizedDominantTopicSchema).optional(),
    supportive_vs_challenging: PersonalizedSupportiveVsChallengingSchema.optional(),
});

export const PersonalizedPersonalSchema = MinimalPersonalSchema.extend({
    active_windows: z.array(PersonalizedActiveWindowSchema).optional(),
    exact_hits: z.array(PersonalizedExactHitSchema).optional(),
    next_shift: PersonalizedNextShiftSchema.optional(),
    dominant_topics: z.array(PersonalizedDominantTopicSchema).optional(),
    supportive_vs_challenging: PersonalizedSupportiveVsChallengingSchema.optional(),
    insights_meta: PersonalizedInsightsMetaSchema.optional(),
    day_context: PersonalizedDayContextSchema.optional(),
});

const ScoresMetaSchema = z.object({
    overall_method: z.string(),
    weights: z.record(z.string(), z.number()),
    rounding: z.string(),
});

export const HoroscopeDataSchema = z.object({
    sign: z.string(),
    date: z.string(),
    scores: HoroscopeScoresSchema,
    score_factors: z.array(ScoreFactorSchema),
    lucky: HoroscopeLuckySchema,
    content: HoroscopeContentSchema,
    astro: HoroscopeAstroSchema,
    personal: MinimalPersonalSchema.optional(),
    scores_meta: ScoresMetaSchema.optional(),
});

export const PersonalizedHoroscopeDataSchema = z.object({
    sign: z.string(),
    date: z.string(),
    scores: HoroscopeScoresSchema,
    score_factors: z.array(ScoreFactorSchema),
    lucky: HoroscopeLuckySchema,
    content: PersonalizedHoroscopeContentSchema,
    astro: HoroscopeAstroSchema,
    personal: PersonalizedPersonalSchema.optional(),
    scores_meta: ScoresMetaSchema.optional(),
});

export const HoroscopeMetaSchema = z.object({
    request_id: z.string(),
    generated_at: z.string(),
    settings: z.object({
        tz_str: z.string().optional(),
        timezone: z.string().optional(),
        locale: z.string().optional(),
        date_resolved: z.string(),
        orb_policy: z.string().optional(),
        version: z.string().optional(),
        include_interpretation_blocks: z.boolean().optional(),
    }),
    cache: z.object({
        hit: z.boolean(),
        ttl_seconds: z.number(),
    }).optional(),
    engine: z.object({
        name: z.string(),
        version: z.string(),
    }),
});

export const HoroscopeApiResponseSchema = z.object({
    meta: HoroscopeMetaSchema,
    data: HoroscopeDataSchema,
});

export const PersonalizedHoroscopeApiResponseSchema = z.object({
    meta: HoroscopeMetaSchema,
    data: PersonalizedHoroscopeDataSchema,
});

export type HoroscopeData = z.infer<typeof HoroscopeDataSchema>;
export type PersonalizedHoroscopeData = z.infer<typeof PersonalizedHoroscopeDataSchema>;
export type HoroscopeScores = z.infer<typeof HoroscopeScoresSchema>;
export type HoroscopeLucky = z.infer<typeof HoroscopeLuckySchema>;
export type HoroscopeContent = z.infer<typeof HoroscopeContentSchema>;
export type PersonalizedHoroscopeContent = z.infer<typeof PersonalizedHoroscopeContentSchema>;
export type HoroscopeAstro = z.infer<typeof HoroscopeAstroSchema>;
export type HoroscopeApiResponse = z.infer<typeof HoroscopeApiResponseSchema>;
export type PersonalizedHoroscopeApiResponse = z.infer<typeof PersonalizedHoroscopeApiResponseSchema>;
export type PersonalizedTransit = z.infer<typeof PersonalizedTransitSchema>;
export type PersonalizedExactHit = z.infer<typeof PersonalizedExactHitSchema>;
export type PersonalizedActiveWindow = z.infer<typeof PersonalizedActiveWindowSchema>;
export type PersonalizedDominantTopic = z.infer<typeof PersonalizedDominantTopicSchema>;
export type PersonalizedNextShift = z.infer<typeof PersonalizedNextShiftSchema>;
export type PersonalizedSupportiveVsChallenging = z.infer<typeof PersonalizedSupportiveVsChallengingSchema>;
export type PersonalizedInsightsMeta = z.infer<typeof PersonalizedInsightsMetaSchema>;
