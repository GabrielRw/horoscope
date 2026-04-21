import { motion } from "framer-motion";
import {
    Activity,
    Briefcase,
    Clock,
    Compass,
    Hash,
    Heart,
    Palette,
    Sparkles,
    Target,
    TrendingUp,
} from "lucide-react";
import { getSign } from "@/lib/signs";
import type { PersonalizedHoroscopeData } from "@/lib/validators";
import {
    buildPersonalizedSummary,
    formatWindowRange,
    formatZonedDateTime,
    getActiveWindows,
    getDominantTopics,
    getExactHits,
    getMatchedTimelineInterpretation,
    getNextShift,
    getSupportingVsChallenging,
    getTimelineNote,
    getTimelineInterpretation,
} from "@/lib/personalized-reading";

interface PersonalizedReadingProps {
    data: PersonalizedHoroscopeData;
    timezone: string;
    locale?: string;
}

function getScoreLabel(score: number): string {
    if (score < 25) return "Challenging";
    if (score < 45) return "Low support";
    if (score < 60) return "Mixed";
    if (score < 75) return "Supportive";
    return "Strong tailwind";
}

function formatEnumLabel(value?: string): string {
    if (!value) return "";

    return value
        .split("_")
        .filter(Boolean)
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
        .join(" ");
}

function splitDateTimeParts(value: string, timezone: string, locale: string) {
    const date = new Date(value);

    return {
        day: new Intl.DateTimeFormat(locale, {
            timeZone: timezone,
            month: "short",
            day: "numeric",
        }).format(date),
        time: new Intl.DateTimeFormat(locale, {
            timeZone: timezone,
            hour: "numeric",
            minute: "2-digit",
        }).format(date),
    };
}

const SCORE_ICONS = {
    overall: <Sparkles className="w-4 h-4" />,
    love: <Heart className="w-4 h-4" />,
    career: <Briefcase className="w-4 h-4" />,
    money: <TrendingUp className="w-4 h-4" />,
    health: <Activity className="w-4 h-4" />,
};

export function PersonalizedReading({
    data,
    timezone,
    locale = "en",
}: PersonalizedReadingProps) {
    const sign = getSign(data.sign);
    const summary = buildPersonalizedSummary(data);
    const note = getTimelineNote(data);
    const supportiveVsChallenging = getSupportingVsChallenging(data);
    const dominantTopics = getDominantTopics(data);
    const nextShift = getNextShift(data);
    const exactHits = getExactHits(data);
    const activeWindows = getActiveWindows(data);
    const focusAreas = data.personal?.focus_areas || [];
    const confidenceScore = data.personal?.confidence_score;

    const firstChar = summary.charAt(0);
    const restOfSummary = summary.slice(1);
    const supportiveTotal =
        (supportiveVsChallenging?.supportive || 0) +
        (supportiveVsChallenging?.challenging || 0);
    const supportiveWidth = supportiveTotal
        ? (supportiveVsChallenging!.supportive / supportiveTotal) * 100
        : 0;
    const featuredTopic = dominantTopics[0];
    const secondaryTopics = dominantTopics.slice(1);

    return (
        <div className="space-y-36 pb-28">
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-12 px-4"
            >
                <div className="text-center space-y-8 mb-20">
                    <span className="text-[12rem] font-astro text-black leading-none block select-none">
                        {sign?.fontChar}
                    </span>
                    <div className="space-y-4">
                        <h1 className="text-7xl font-light text-black tracking-tighter uppercase">
                            {sign?.name || data.sign}
                        </h1>
                        <div className="flex flex-wrap justify-center gap-2">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-black/50 border border-black/10 px-3 py-1">
                                {data.content.theme}
                            </span>
                            {focusAreas.slice(0, 3).map((area) => (
                                <span
                                    key={area}
                                    className="text-[10px] uppercase tracking-[0.2em] text-black/40 border border-black/5 px-3 py-1"
                                >
                                    {area}
                                </span>
                            ))}
                            {typeof confidenceScore === "number" && (
                                <span className="text-[10px] uppercase tracking-[0.2em] text-black/40 border border-black/5 px-3 py-1">
                                    Confidence {confidenceScore}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4">
                    {note && (
                        <div className="mb-6 text-[10px] uppercase tracking-[0.25em] text-black/35">
                            {note}
                        </div>
                    )}

                    <main className="relative">
                        <p className="text-2xl md:text-3xl text-black font-light leading-[1.7] serif text-pretty text-left">
                            {firstChar && (
                                <span className="float-left text-[6rem] md:text-[7rem] font-light leading-[0.8] mr-4 mt-2 select-none text-black/10 border-r border-black/5 pr-6 italic mb-1">
                                    {firstChar}
                                </span>
                            )}
                            {restOfSummary || summary}
                        </p>
                    </main>

                    <div className="mt-12 flex flex-wrap gap-2">
                        {data.content.keywords.map((keyword) => (
                            <span
                                key={keyword}
                                className="text-[10px] uppercase tracking-[0.2em] text-black/55 bg-black/[0.03] px-3 py-1.5"
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.section>

            <section className="max-w-5xl mx-auto px-4">
                <div className="mb-12 flex items-center gap-8">
                    <h2 className="text-[10px] uppercase tracking-[0.4em] text-black flex-shrink-0">
                        Current Influences
                    </h2>
                    <div className="h-px w-full bg-black/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8">
                    <div className="border border-black/8 p-8 space-y-6">
                        <div className="flex items-center gap-2 text-black/35">
                            <Compass className="w-4 h-4" />
                            <span className="text-[10px] uppercase tracking-[0.25em]">
                                Focus areas
                            </span>
                        </div>
                        {focusAreas.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {focusAreas.map((area) => (
                                    <span
                                        key={area}
                                        className="text-[10px] uppercase tracking-[0.16em] text-black/70 bg-black/[0.03] px-3 py-2 font-medium"
                                    >
                                        {area}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-black/50">
                                No explicit focus areas were returned for this day.
                            </p>
                        )}
                    </div>

                    <div className="border border-black/8 p-8 space-y-6">
                        <div className="flex items-center gap-2 text-black/35">
                            <Target className="w-4 h-4" />
                            <span className="text-[10px] uppercase tracking-[0.25em]">
                                Supportive vs challenging
                            </span>
                        </div>
                        {supportiveVsChallenging ? (
                            <>
                                <div className="h-2 bg-black/5">
                                    <div
                                        className="h-full bg-black"
                                        style={{ width: `${supportiveWidth}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-black/70">
                                        Supportive {supportiveVsChallenging.supportive}
                                    </span>
                                    <span className="text-black/45">
                                        Challenging {supportiveVsChallenging.challenging}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-black/50">
                                No day-balance metrics were returned for this reading.
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-8 border border-black/8 p-8 md:p-10 space-y-8">
                    <div className="flex items-center gap-2 text-black/35">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-[0.25em]">
                            Dominant topics
                        </span>
                    </div>
                    {featuredTopic ? (
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.9fr] gap-6 border border-black/6 bg-[linear-gradient(135deg,rgba(0,0,0,0.02),rgba(0,0,0,0.00))] p-7 md:p-8">
                                <div className="space-y-5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[10px] uppercase tracking-[0.22em] text-black/45 border border-black/10 px-3 py-1">
                                            {formatEnumLabel(featuredTopic.focus_type || featuredTopic.category || "live_theme")}
                                        </span>
                                        {featuredTopic.category && featuredTopic.focus_type && (
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-black/30">
                                                {formatEnumLabel(featuredTopic.category)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-3xl md:text-4xl font-light serif text-black leading-tight max-w-2xl">
                                            {featuredTopic.title}
                                        </h3>
                                        <p className="text-sm md:text-base text-black/55 leading-relaxed max-w-xl">
                                            This is the background pattern carrying the most weight in today&apos;s reading.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 content-start">
                                    <div className="border border-black/6 bg-white/80 p-4 space-y-1">
                                        <p className="text-[9px] uppercase tracking-[0.22em] text-black/35">
                                            Strength
                                        </p>
                                        <p className="text-2xl font-light text-black">
                                            {typeof featuredTopic.score === "number"
                                                ? `${Math.round(featuredTopic.score * 100)}%`
                                                : "Live"}
                                        </p>
                                    </div>
                                    <div className="border border-black/6 bg-white/80 p-4 space-y-1">
                                        <p className="text-[9px] uppercase tracking-[0.22em] text-black/35">
                                            Peak
                                        </p>
                                        <p className="text-base font-medium text-black leading-tight">
                                            {featuredTopic.peak_datetime
                                                ? formatZonedDateTime(featuredTopic.peak_datetime, timezone, locale)
                                                : "Ongoing"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {secondaryTopics.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {secondaryTopics.map((topic) => (
                                        <div key={topic.title} className="border border-black/6 p-5 space-y-3">
                                            <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">
                                                {formatEnumLabel(topic.focus_type || topic.category || "Live theme")}
                                            </p>
                                            <p className="text-xl font-light serif text-black">
                                                {topic.title}
                                            </p>
                                            <div className="flex items-center justify-between gap-3 text-sm text-black/50">
                                                <span>
                                                    {typeof topic.score === "number"
                                                        ? `Strength ${Math.round(topic.score * 100)}%`
                                                        : "Active"}
                                                </span>
                                                <span>
                                                    {topic.peak_datetime
                                                        ? formatZonedDateTime(topic.peak_datetime, timezone, locale)
                                                        : "No peak set"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-black/50">
                            No dominant topic cluster was returned for this day.
                        </p>
                    )}
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-4">
                <div className="mb-12 flex items-center gap-8">
                    <h2 className="text-[10px] uppercase tracking-[0.4em] text-black flex-shrink-0">
                        Timeline
                    </h2>
                    <div className="h-px w-full bg-black/5" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.95fr] gap-8">
                    <div className="border border-black/8 p-8 md:p-10 space-y-8 bg-[linear-gradient(180deg,rgba(0,0,0,0.015),rgba(0,0,0,0.0))]">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] uppercase tracking-[0.25em] text-black/35">
                                Exact hits
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.18em] text-black/25">
                                Ordered by time
                            </p>
                        </div>
                        {exactHits.length > 0 ? (
                            <div className="space-y-2">
                                {exactHits.slice(0, 4).map((hit, index) => {
                                    const parts = splitDateTimeParts(hit.timestamp, timezone, locale);

                                        return (
                                            <div
                                                key={`${hit.label}-${hit.timestamp}`}
                                                className="grid grid-cols-[auto_1fr] gap-4 items-start border border-black/6 px-4 py-4"
                                            >
                                                <div className="w-8 h-8 border border-black/8 rounded-full flex items-center justify-center text-[10px] font-medium text-black/45">
                                                    {index + 1}
                                                </div>
                                                <div className="min-w-0">
                                                <p className="text-base text-black leading-tight">
                                                    {hit.label}
                                                </p>
                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-black/40 uppercase tracking-[0.16em]">
                                                    <span>{parts.day}</span>
                                                    <span>{parts.time}</span>
                                                    {hit.category && (
                                                        <span className="border border-black/8 px-2 py-0.5 normal-case tracking-normal text-[10px]">
                                                            {formatEnumLabel(hit.category)}
                                                        </span>
                                                    )}
                                                </div>
                                                {getTimelineInterpretation(data, hit.label) && (
                                                        <p className="mt-3 text-sm text-black/62 leading-relaxed max-w-xl">
                                                            {getTimelineInterpretation(data, hit.label)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                        ) : (
                            <p className="text-sm text-black/50">
                                No exact-hit timeline events were returned.
                            </p>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div className="border border-black/8 p-8 md:p-10 space-y-6">
                            <div className="flex items-center gap-2 text-black/35">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-[10px] uppercase tracking-[0.25em]">
                                    Windows in effect
                                </span>
                            </div>
                            <p className="text-sm text-black/50 leading-relaxed">
                                Transit windows currently shaping the background of the day. These can matter just as much as an exact hit because they describe the wider period in which an influence stays active.
                            </p>
                            {activeWindows.length > 0 ? (
                                <div className="space-y-4">
                                    {activeWindows.slice(0, 5).map((window) => (
                                        <div key={window.id} className="border border-black/6 p-5 space-y-4 bg-white/80">
                                            <div className="flex items-start justify-between gap-3">
                                                <p className="text-base md:text-lg text-black leading-snug">{window.label}</p>
                                                {window.category && (
                                                    <span className="text-[9px] uppercase tracking-[0.2em] text-black/35 border border-black/8 px-2 py-1">
                                                        {formatEnumLabel(window.category)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] uppercase tracking-[0.16em] text-black/32">
                                                {formatWindowRange(window.start, window.end, timezone, locale)}
                                            </p>
                                            {getMatchedTimelineInterpretation(data, window.label) && (
                                                <p className="text-sm text-black/62 leading-relaxed">
                                                    {getMatchedTimelineInterpretation(data, window.label)}
                                                </p>
                                            )}
                                            {window.exact_hits && window.exact_hits.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {window.exact_hits.map((value) => (
                                                        <span
                                                            key={value}
                                                            className="text-[10px] text-black/42 border border-black/8 px-2.5 py-1"
                                                        >
                                                            {formatZonedDateTime(value, timezone, locale)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-black/50">
                                    No active transit windows were returned.
                                </p>
                            )}
                        </div>

                        <div className="border border-black/8 p-8 md:p-10 space-y-6 bg-[linear-gradient(180deg,rgba(0,0,0,0.015),rgba(0,0,0,0.0))]">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-2 text-black/35">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-[10px] uppercase tracking-[0.25em]">
                                        Next exact peak
                                    </span>
                                </div>
                                {exactHits.length > 0 && (
                                    <span className="text-[10px] uppercase tracking-[0.22em] text-black/35 border border-black/8 px-3 py-1">
                                        {exactHits.length} exact hits incoming
                                    </span>
                                )}
                            </div>
                            {nextShift ? (
                                <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
                                    <div className="space-y-3">
                                        <p className="text-2xl md:text-[2.1rem] font-light serif text-black leading-tight max-w-xl">
                                            {nextShift.label}
                                        </p>
                                        {getTimelineInterpretation(data, nextShift.label) && (
                                            <p className="text-base text-black/70 leading-relaxed max-w-xl">
                                                {getTimelineInterpretation(data, nextShift.label)}
                                            </p>
                                        )}
                                        <p className="text-sm text-black/55 max-w-xl leading-relaxed">
                                            This marks the next moment when one active influence reaches peak precision. Treat it as a timing cue, not automatically the strongest influence in the whole reading.
                                        </p>
                                    </div>
                                    <div className="border border-black/8 p-5 bg-white/80 space-y-2">
                                        <p className="text-[9px] uppercase tracking-[0.22em] text-black/35">
                                            Scheduled for
                                        </p>
                                        <p className="text-base font-medium text-black">
                                            {formatZonedDateTime(nextShift.timestamp, timezone, locale)}
                                        </p>
                                        {nextShift.type && (
                                            <p className="text-[10px] uppercase tracking-[0.18em] text-black/35">
                                                {formatEnumLabel(nextShift.type)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-black/50">
                                    No upcoming shift marker was returned for this reading.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 pt-20 border-t border-black/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-8">
                        <h2 className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-bold">
                            Energy Forecast
                        </h2>
                        <div className="space-y-10">
                            {(["overall", "love", "career", "money", "health"] as const).map((dimension) => {
                                const value = data.scores[dimension] ?? 0;
                                const factor = data.score_factors.find((entry) => entry.dimension === dimension);
                                const reason = factor
                                    ? typeof factor.reason === "string"
                                        ? factor.reason
                                        : factor.reason.main
                                    : null;
                                const drivers = factor?.drivers || [];

                                return (
                                    <div key={dimension} className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center gap-3">
                                                <span className="text-black/50">{SCORE_ICONS[dimension]}</span>
                                                <span className="text-[11px] uppercase tracking-widest text-black/90 font-bold">
                                                    {dimension}
                                                </span>
                                                <span className="text-[10px] uppercase tracking-widest text-black/60 font-bold italic">
                                                    {getScoreLabel(value)}
                                                </span>
                                            </div>
                                            <span className="text-sm font-mono text-black/60 font-medium">
                                                {value}%
                                            </span>
                                        </div>
                                        <div className="h-[2px] w-full bg-black/5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${value}%` }}
                                                viewport={{ once: true }}
                                                className="h-full bg-black"
                                            />
                                        </div>
                                        {reason && (
                                            <p className="text-[11px] text-black/60 leading-relaxed font-medium">
                                                {reason}
                                            </p>
                                        )}
                                        {drivers.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {drivers.slice(0, 2).map((driver, index) => (
                                                    <div
                                                        key={`${driver.key}-${index}`}
                                                        className="text-[9px] uppercase tracking-wider text-black/50 bg-black/[0.02] px-2 py-1 rounded-sm border border-black/5 font-medium"
                                                    >
                                                        {driver.label || driver.key}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div className="space-y-8">
                            <h2 className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                                Cosmic State
                            </h2>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <span className="text-[9px] uppercase text-black/40 block">Moon sign</span>
                                    <p className="text-sm font-medium uppercase tracking-tight">
                                        {data.astro.moon_sign.label}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[9px] uppercase text-black/40 block">Moon phase</span>
                                    <p className="text-sm font-medium uppercase tracking-tight">
                                        {data.astro.moon_phase.label}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-[10px] uppercase tracking-[0.3em] text-black/40">
                                Daily Anchors
                            </h2>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Palette className="w-3 h-3 text-black/20" />
                                        <span className="text-[9px] uppercase text-black/40 block">Color</span>
                                    </div>
                                    <p className="text-sm font-medium uppercase tracking-tight">
                                        {data.lucky.color.label}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Hash className="w-3 h-3 text-black/20" />
                                        <span className="text-[9px] uppercase text-black/40 block">Number</span>
                                    </div>
                                    <p className="text-sm font-medium uppercase tracking-tight">
                                        {data.lucky.number}
                                    </p>
                                </div>
                                <div className="space-y-2 text-right">
                                    <div className="flex items-center gap-2 justify-end">
                                        <Clock className="w-3 h-3 text-black/20" />
                                        <span className="text-[9px] uppercase text-black/40 block">Window</span>
                                    </div>
                                    <p className="text-sm font-medium uppercase tracking-tight">
                                        {typeof data.lucky.time_window === "string"
                                            ? data.lucky.time_window
                                            : data.lucky.time_window.display}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
