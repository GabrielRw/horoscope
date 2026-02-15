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

const ScoreFactorSchema = z.object({
    dimension: z.string(),
    reason: z.string(),
});

export const HoroscopeScoresSchema = z.object({
    overall: z.number().optional(),
    love: z.number(),
    career: z.number(),
    money: z.number(),
    health: z.number(),
});

export const HoroscopeLuckySchema = z.object({
    color: KeyLabelSchema,
    number: z.number(),
    time_window: z.string(),
});

export const HoroscopeContentSchema = z.object({
    text: z.string(),
    theme: z.string(),
    keywords: z.array(z.string()),
    do: z.array(z.string()).optional(),
    dont: z.array(z.string()).optional(),
    supporting_insights: z.array(z.string()).optional(),
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

const TransitSchema = z.object({
    transit_planet: KeyLabelSchema,
    natal_planet: KeyLabelSchema,
    aspect: KeyLabelSchema,
    orb_deg: z.number(),
    score: z.number(),
    explanation: z.union([z.string(), TransitExplanationSchema]),
    is_applying: z.boolean(),
    exact_at: z.string().nullable(),
});

const PersonalSchema = z.object({
    transits_top: z.array(TransitSchema),
    focus_areas: z.array(z.string()).optional(),
    confidence_score: z.number().optional(),
});

export const HoroscopeDataSchema = z.object({
    sign: z.string(),
    date: z.string(),
    scores: HoroscopeScoresSchema,
    score_factors: z.array(ScoreFactorSchema),
    lucky: HoroscopeLuckySchema,
    content: HoroscopeContentSchema,
    astro: HoroscopeAstroSchema,
    personal: PersonalSchema.optional(),
});

export const HoroscopeMetaSchema = z.object({
    request_id: z.string(),
    generated_at: z.string(),
    settings: z.object({
        tz_str: z.string().optional(),
        timezone: z.string().optional(),
        locale: z.string(),
        date_resolved: z.string(),
        orb_policy: z.string(),
    }),
    cache: z.object({
        hit: z.boolean(),
        ttl_seconds: z.number(),
    }),
    engine: z.object({
        name: z.string(),
        version: z.string(),
    }),
});

export const HoroscopeApiResponseSchema = z.object({
    meta: HoroscopeMetaSchema,
    data: HoroscopeDataSchema,
});

export type HoroscopeData = z.infer<typeof HoroscopeDataSchema>;
export type HoroscopeScores = z.infer<typeof HoroscopeScoresSchema>;
export type HoroscopeLucky = z.infer<typeof HoroscopeLuckySchema>;
export type HoroscopeContent = z.infer<typeof HoroscopeContentSchema>;
export type HoroscopeAstro = z.infer<typeof HoroscopeAstroSchema>;
export type HoroscopeApiResponse = z.infer<typeof HoroscopeApiResponseSchema>;
