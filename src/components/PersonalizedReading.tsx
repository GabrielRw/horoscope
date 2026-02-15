"use client";

import { motion } from "framer-motion";
import type { HoroscopeData } from "@/lib/validators";
import { getSign } from "@/lib/signs";
import {
    Heart,
    Briefcase,
    DollarSign,
    Activity,
    Star,
    Clock,
    Zap,
    Target,
    Compass,
    Sparkles,
    ChevronRight,
} from "lucide-react";

interface PersonalizedReadingProps {
    data: HoroscopeData;
}

const SCORE_ICONS: Record<string, React.ReactNode> = {
    love: <Heart className="w-4 h-4" />,
    career: <Briefcase className="w-4 h-4" />,
    money: <DollarSign className="w-4 h-4" />,
    health: <Activity className="w-4 h-4" />,
};

function TransitCard({ transit, index }: { transit: any; index: number }) {
    const { transit_planet, natal_planet, aspect, explanation, score, tags } = transit;
    const mainText = typeof explanation === 'string' ? explanation : explanation.main;
    const supporting = typeof explanation === 'object' ? explanation.supporting : [];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative border-l-2 border-black/5 pl-8 pb-20 last:pb-0"
        >
            {/* Timeline Dot */}
            <div className="absolute left-[-5.5px] top-0 w-[9px] h-[9px] rounded-full bg-black group-hover:scale-125 transition-transform" />

            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                            {transit_planet.label} {aspect.label} {natal_planet.label}
                        </span>
                        {score > 80 && (
                            <span className="px-2 py-0.5 bg-black text-white text-[8px] font-bold uppercase tracking-widest rounded-none">
                                Significant
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <p className="text-xl md:text-2xl font-light leading-relaxed text-black serif">
                        {mainText}
                    </p>

                    {supporting && supporting.length > 0 && (
                        <div className="space-y-4 pt-2">
                            {supporting.map((point: string, i: number) => (
                                <div key={i} className="flex gap-4 items-start text-sm text-black/70 leading-relaxed group/point">
                                    <div className="w-1.5 h-px bg-black/30 mt-2.5 flex-shrink-0 group-hover/point:w-3 transition-all" />
                                    <span>{point}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4">
                        {tags.map((tag: string) => (
                            <span key={tag} className="text-[8px] uppercase tracking-[0.2em] text-black/30 border border-black/5 px-2 py-1">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export function PersonalizedReading({ data }: PersonalizedReadingProps) {
    const sign = getSign(data.sign);
    const { scores, content, astro, personal } = data;

    // Drop cap logic: Get the first character and the rest of the text
    const firstChar = content.text.charAt(0);
    const restOfText = content.text.slice(1);

    return (
        <div className="space-y-48 pb-32">
            {/* 1. Hero Summary - Editorial Grid */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-12 px-4"
            >
                {/* Sign Icon & Name (Still Centered Top) */}
                <div className="text-center space-y-8 mb-24">
                    <span className="text-[12rem] font-astro text-black leading-none block select-none">
                        {sign?.fontChar}
                    </span>
                    <div className="space-y-3">
                        <h1 className="text-7xl font-light text-black tracking-tighter uppercase mb-2">
                            {sign?.name}
                        </h1>
                        <div className="flex items-center justify-center gap-4 text-black/20">
                            <div className="h-px w-8 bg-current" />
                            <p className="text-[10px] uppercase tracking-[0.5em] font-medium">
                                Daily Alignment
                            </p>
                            <div className="h-px w-8 bg-current" />
                        </div>
                    </div>
                </div>

                {/* The Reading Container - Centered but Left-Aligned Text */}
                <div className="max-w-3xl mx-auto px-4">
                    {/* Simplified Metadata */}
                    <div className="mb-12 flex flex-wrap justify-between items-end gap-6 pb-8 border-b border-black/5">
                        <div className="space-y-2 text-left">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 block">
                                Primary Theme
                            </span>
                            <h4 className="text-lg font-light text-black italic serif lowercase">
                                {content.theme}
                            </h4>
                        </div>
                        <div className="flex gap-4">
                            {content.keywords.slice(0, 3).map((kw) => (
                                <span key={kw} className="text-[10px] uppercase tracking-widest text-black/40 border border-black/10 px-2 py-1">
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </div>

                    <main className="relative">
                        <p className="text-2xl md:text-3xl text-black font-light leading-[1.7] serif text-pretty text-left">
                            <span className="float-left text-[6rem] md:text-[7rem] font-light leading-[0.8] mr-4 mt-2 select-none text-black/10 border-r border-black/5 pr-6 italic mb-1">
                                {firstChar}
                            </span>
                            {restOfText}
                        </p>

                        {content.supporting_insights && content.supporting_insights.length > 0 && (
                            <div className="mt-16 space-y-4 text-left">
                                {content.supporting_insights.map((insight, i) => (
                                    <p key={i} className="text-sm text-black/40 leading-relaxed italic">
                                        &mdash; {insight}
                                    </p>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </motion.section>

            {/* 2. Personalized Transit Breakdown */}
            {personal?.transits_top && (
                <section className="max-w-3xl mx-auto px-4">
                    <div className="mb-20 flex items-center gap-8">
                        <h3 className="text-[10px] uppercase tracking-[0.4em] text-black flex-shrink-0">Transit Deep-Dive</h3>
                        <div className="h-px w-full bg-black/5" />
                    </div>

                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute left-0 top-0 w-px h-full bg-black/10 ml-[1px]" />

                        <div className="space-y-12">
                            {personal.transits_top.map((transit, i) => (
                                <TransitCard key={i} transit={transit} index={i} />
                            ))}
                        </div>
                    </div>
                </section>
            )}


            {/* 3. Actionable Guidance (Do/Don't) */}


            {/* 4. Functional Grid (Scores & Meta) */}
            <section className="max-w-4xl mx-auto px-4 pt-20 border-t border-black/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Daily Scores */}
                    <div className="space-y-8">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] text-black/40">Vitality Levels</h3>
                        <div className="space-y-6">
                            {(["overall", "love", "career", "money", "health"] as const).map((dim) => (
                                <div key={dim} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] uppercase tracking-widest text-black/60">{dim}</span>
                                        <span className="text-xs font-mono text-black/40">{scores[dim] ?? 0}%</span>
                                    </div>
                                    <div className="h-[2px] w-full bg-black/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${scores[dim] ?? 0}%` }}
                                            viewport={{ once: true }}
                                            className="h-full bg-black"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cosmic Meta */}
                    <div className="space-y-12">
                        <div className="space-y-8">
                            <h3 className="text-[10px] uppercase tracking-[0.3em] text-black/40">Cosmic State</h3>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <span className="text-[9px] uppercase text-black/40 block">Moon Sign</span>
                                    <p className="text-sm font-medium uppercase tracking-tight">{astro.moon_sign.label}</p>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[9px] uppercase text-black/40 block">Moon Phase</span>
                                    <p className="text-sm font-medium uppercase tracking-tight">{astro.moon_phase.label}</p>
                                </div>
                            </div>
                        </div>

                        {data.lucky && (
                            <div className="space-y-8">
                                <h3 className="text-[10px] uppercase tracking-[0.3em] text-black/40">Daily Anchors</h3>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <span className="text-[9px] uppercase text-black/40 block">Color</span>
                                        <p className="text-sm font-medium uppercase tracking-tight">{data.lucky.color.label}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[9px] uppercase text-black/40 block">Number</span>
                                        <p className="text-sm font-medium uppercase tracking-tight">{data.lucky.number}</p>
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <span className="text-[9px] uppercase text-black/40 block">Window</span>
                                        <p className="text-sm font-medium uppercase tracking-tight">{data.lucky.time_window}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
