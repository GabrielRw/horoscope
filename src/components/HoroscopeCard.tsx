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
    Palette,
    Hash,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HoroscopeCardProps {
    data: HoroscopeData;
}

const SCORE_ICONS: Record<string, React.ReactNode> = {
    love: <Heart className="w-4 h-4" />,
    career: <Briefcase className="w-4 h-4" />,
    money: <DollarSign className="w-4 h-4" />,
    health: <Activity className="w-4 h-4" />,
};

function ScoreBar({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-white/50">{icon}</span>
            <span className="text-sm text-white/70 w-16 capitalize">{label}</span>
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                />
            </div>
            <span className="text-sm font-medium text-white/80 w-8 text-right">{value}</span>
        </div>
    );
}

export function HoroscopeCard({ data }: HoroscopeCardProps) {
    const sign = getSign(data.sign);
    const { scores, content, lucky, astro, score_factors, personal } = data;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-16"
        >
            {/* Main Reading */}
            <motion.div
                variants={itemVariants}
                className="max-w-3xl mx-auto text-center"
            >
                <div className="mb-8 flex flex-wrap justify-center gap-3">
                    <span className="px-3 py-1.5 border border-black/10 text-[10px] uppercase tracking-widest text-black/60">
                        {content.theme}
                    </span>
                    {[...new Set(content.keywords)].map((kw) => (
                        <span key={kw} className="px-3 py-1.5 border border-black/10 text-[10px] uppercase tracking-widest text-black/60">
                            {kw}
                        </span>
                    ))}
                </div>
                <p className="text-2xl md:text-3xl text-black font-light leading-normal serif">
                    &ldquo;{content.text}&rdquo;
                </p>
                {content.supporting_insights && content.supporting_insights.length > 0 && (
                    <div className="mt-8 space-y-2">
                        {content.supporting_insights.map((insight, i) => (
                            <p key={i} className="text-sm text-black/60 italic">
                                {insight}
                            </p>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Data Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10 border border-black/10">
                {/* Scores */}
                <div className="bg-white p-10 space-y-8">
                    <h3 className="text-xs uppercase tracking-widest text-black/60 mb-6">Daily Scores</h3>
                    <div className="space-y-6">
                        {scores.overall && (
                            <div className="space-y-2 pb-6 border-b border-black/5">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs uppercase tracking-widest w-16 text-black/60">Overall</span>
                                    <div className="flex-1 h-px bg-black/10">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${scores.overall}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full bg-black"
                                        />
                                    </div>
                                    <span className="text-xs font-mono text-black/60 w-8 text-right">{scores.overall}</span>
                                </div>
                            </div>
                        )}
                        {(["love", "career", "money", "health"] as const).map((dim) => {
                            const factor = score_factors.find((f) => f.dimension === dim);
                            return (
                                <div key={dim} className="space-y-2">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs uppercase tracking-widest w-16 text-black/60">{dim}</span>
                                        <div className="flex-1 h-px bg-black/10">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${scores[dim]}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="h-full bg-black"
                                            />
                                        </div>
                                        <span className="text-xs font-mono text-black/60 w-8 text-right">{scores[dim]}</span>
                                    </div>
                                    {factor && (
                                        <div className="pl-20 text-[10px] text-black/40 italic">
                                            {factor.reason}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Lucky & Astro */}
                <div className="bg-white p-10 space-y-10">
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-black/60 mb-6">Cosmic Context</h3>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <span className="text-[10px] uppercase text-black/50 block mb-1">Moon Phase</span>
                                <span className="text-sm text-black">{astro.moon_phase.label}</span>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase text-black/50 block mb-1">Moon Sign</span>
                                <span className="text-sm text-black">{astro.moon_sign.label}</span>
                            </div>
                        </div>

                        {astro.highlights.filter(h => h.type === 'sky_aspect').length > 0 && (
                            <div className="space-y-2 pt-6 border-t border-black/5">
                                <span className="text-[10px] uppercase text-black/50 block mb-2">Planetary Aspects</span>
                                {astro.highlights
                                    .filter(h => h.type === 'sky_aspect')
                                    .map((h, i) => (
                                        <div key={i} className="text-sm text-black">
                                            {h.label}
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Guidance */}
            {(content.do && content.do.length > 0) || (content.dont && content.dont.length > 0) ? (
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10 border border-black/10">
                    <div className="bg-white p-10">
                        <h3 className="text-xs uppercase tracking-widest text-black/60 mb-6">Do</h3>
                        {content.do && (
                            <ul className="space-y-3">
                                {content.do.map((item, i) => (
                                    <li key={i} className="text-sm text-black/80 flex items-baseline gap-4">
                                        <span className="text-black/20 text-xs">+</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="bg-white p-10">
                        <h3 className="text-xs uppercase tracking-widest text-black/60 mb-6">Don&apos;t</h3>
                        {content.dont && (
                            <ul className="space-y-3">
                                {content.dont.map((item, i) => (
                                    <li key={i} className="text-sm text-black/80 flex items-baseline gap-4">
                                        <span className="text-black/20 text-xs">-</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </motion.div>
            ) : null}
        </motion.div>
    );
}
