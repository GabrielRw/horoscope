"use client";
import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
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
    Palette,
    Hash,
    X,
    Info,
} from "lucide-react";

interface PersonalizedReadingProps {
    data: HoroscopeData;
}

export function getScoreLabel(score: number): string {
    if (score < 25) return "Challenging";
    if (score < 45) return "Tense / Low support";
    if (score < 60) return "Mixed";
    if (score < 75) return "Supportive";
    return "Strong tailwind";
}

const SCORE_ICONS: Record<string, React.ReactNode> = {
    love: <Heart className="w-4 h-4" />,
    career: <Briefcase className="w-4 h-4" />,
    money: <DollarSign className="w-4 h-4" />,
    health: <Activity className="w-4 h-4" />,
};

function OrbModal({ isOpen, onClose, orb }: { isOpen: boolean; onClose: () => void; orb: number | null }) {
    if (orb === null) return null;

    const absOrb = Math.abs(orb);
    let intensity = "Subtle";
    let classification = "Wide";

    if (absOrb <= 1.0) { intensity = "Maximum"; classification = "Very Tight"; }
    else if (absOrb <= 3.0) { intensity = "High"; classification = "Tight"; }
    else if (absOrb <= 5.0) { intensity = "Moderate"; classification = "Active"; }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] cursor-pointer"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white border border-black/10 p-8 shadow-2xl z-[101]"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-black/20 hover:text-black transition-colors">
                            <X className="w-4 h-4" />
                        </button>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-black/20">
                                    <Info className="w-3 h-3" />
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Orb Strength</span>
                                </div>
                                <h3 className="text-2xl font-light serif italic lowercase">
                                    {classification} ({absOrb.toFixed(1)}°)
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm text-black/60 leading-relaxed">
                                    An <strong>orb</strong> is the mathematical "margin of error" between two points. The closer the orb is to 0.0°, the more intense the cosmic resonance.
                                </p>

                                <div className="p-4 bg-black/[0.02] border border-black/5">
                                    <p className="text-xs text-black/40 uppercase tracking-widest mb-1">Impact Level</p>
                                    <p className="text-sm font-medium">{intensity} Intensity</p>
                                    <p className="text-[10px] text-black/30 mt-2 italic">
                                        This aspect is {classification.toLowerCase()}, meaning its influence is {absOrb <= 3 ? "dominating" : "subtly shaping"} your energy today.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-4 text-[10px] uppercase tracking-[0.3em] border border-black/10 hover:bg-black hover:text-white transition-all font-bold"
                            >
                                Continue Reading
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function TransitCard({ transit, index, onOrbClick }: { transit: any; index: number; onOrbClick: (orb: number) => void }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { transit_planet, natal_planet, aspect, explanation, score, tags, orb_deg } = transit;
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
            <div className="absolute left-[-5.5px] top-1 w-[9px] h-[9px] rounded-full bg-white border border-black group-hover:bg-black transition-colors z-10" />

            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/50">
                            {transit_planet.label} <span className="text-black/30 px-1 italic low-caps">{aspect.label}</span> {natal_planet.label}
                        </span>
                        <button
                            onClick={() => onOrbClick(orb_deg)}
                            className="text-[9px] uppercase tracking-widest text-black/20 font-medium hover:text-black transition-colors border-b border-black/5 hover:border-black/20"
                        >
                            Orb: {Math.abs(orb_deg).toFixed(1)}°
                        </button>
                        {score > 80 && (
                            <span className="px-2 py-0.5 bg-black text-white text-[8px] font-bold uppercase tracking-widest rounded-none">
                                Significant Shift
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
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors group/btn"
                            >
                                {isExpanded ? "Hide Guidance" : "Show Guidance"}
                                <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                            </button>

                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
                                    {supporting.map((point: string, i: number) => (
                                        <div key={i} className="flex gap-4 items-start text-sm text-black/70 leading-relaxed group/point">
                                            <div className="w-1.5 h-px bg-black/30 mt-2.5 flex-shrink-0 group-hover/point:w-3 transition-all" />
                                            <span>{point}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>

                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4">
                        {tags.map((tag: string) => (
                            <span key={tag} className="text-[9px] uppercase tracking-[0.2em] text-black/50 border border-black/10 px-2.5 py-1 font-medium">
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
    const [explainingOrb, setExplainingOrb] = useState<number | null>(null);
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
                        {personal?.confidence_score && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col items-center justify-center gap-2 pt-6"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] uppercase tracking-[0.3em] text-black/60 font-semibold">
                                        Alignment Strength: {personal.confidence_score}%
                                    </span>
                                </div>
                                <p className="text-[10px] text-black/30 max-w-sm mx-auto leading-relaxed whitespace-pre-line">
                                    Alignment Strength shows how focused today’s influences are.{"\n"}
                                    When high, everything centers around a clear theme.{"\n"}
                                    When low, the energy feels mixed or contradictory.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* The Reading Container - Centered but Left-Aligned Text */}
                <div className="max-w-3xl mx-auto px-4">
                    {/* Simplified Metadata */}
                    <div className="mb-12 space-y-8 pb-8 border-b border-black/5">
                        {personal?.focus_areas && personal.focus_areas.length > 0 && (
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-semibold">Focus Areas</span>
                                    <div className="h-px flex-1 bg-black/5" />
                                    <span className="text-[9px] italic text-black/20">Active life sectors today</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {personal.focus_areas.map((area) => (
                                        <span key={area} className="text-[10px] uppercase tracking-[0.1em] text-black/70 bg-black/[0.04] px-3 py-1 font-medium">
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <main className="relative">
                        <p className="text-2xl md:text-3xl text-black font-light leading-[1.7] serif text-pretty text-left">
                            <span className="float-left text-[6rem] md:text-[7rem] font-light leading-[0.8] mr-4 mt-2 select-none text-black/10 border-r border-black/5 pr-6 italic mb-1">
                                {firstChar}
                            </span>
                            {restOfText}
                        </p>

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
                        <div className="absolute left-0 top-2 w-px h-full bg-gradient-to-b from-black/20 via-black/10 to-transparent ml-[1px]" />

                        <div className="space-y-12">
                            {[...personal.transits_top]
                                .sort((a, b) => Math.abs(a.orb_deg) - Math.abs(b.orb_deg))
                                .map((transit, i) => (
                                    <TransitCard
                                        key={i}
                                        transit={transit}
                                        index={i}
                                        onOrbClick={(orb) => setExplainingOrb(orb)}
                                    />
                                ))}
                        </div>

                        <OrbModal
                            isOpen={explainingOrb !== null}
                            onClose={() => setExplainingOrb(null)}
                            orb={explainingOrb}
                        />
                    </div>
                </section>
            )}


            {/* 3. Actionable Guidance (Do/Don't) */}


            {/* 4. Functional Grid (Scores & Meta) */}
            <section className="max-w-4xl mx-auto px-4 pt-20 border-t border-black/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Daily Scores */}
                    <div className="space-y-8">
                        <div className="flex justify-between items-end">
                            <h3 className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-bold">Energy Forecast</h3>
                            {personal?.confidence_score && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex items-center justify-center gap-2"
                                >
                                    <span className="text-[11px] uppercase tracking-[0.3em] text-black/40 font-medium">
                                        Alignment Strength: {personal.confidence_score}%
                                    </span>
                                </motion.div>
                            )}
                        </div>
                        <div className="space-y-10">
                            {(["overall", "love", "career", "money", "health"] as const).map((dim) => {
                                const factor = data.score_factors.find(f => f.dimension === dim);
                                const reason = factor ? (typeof factor.reason === 'string' ? factor.reason : factor.reason.main) : null;

                                return (
                                    <div key={dim} className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[11px] uppercase tracking-widest text-black/90 font-bold">{dim}</span>
                                                <span className="text-[10px] uppercase tracking-widest text-black/60 font-bold italic">
                                                    {getScoreLabel(scores[dim] ?? 0)}
                                                </span>
                                            </div>
                                            <span className="text-sm font-mono text-black/60 font-medium">{scores[dim] ?? 0}%</span>
                                        </div>
                                        <div className="h-[2px] w-full bg-black/5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${scores[dim] ?? 0}%` }}
                                                viewport={{ once: true }}
                                                className="h-full bg-black"
                                            />
                                        </div>
                                        {reason && (
                                            <p className="text-[11px] text-black/60 leading-relaxed font-medium">
                                                {reason}
                                            </p>
                                        )}
                                        {factor?.drivers && factor.drivers.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {factor.drivers.slice(0, 2).map((driver) => (
                                                    <span key={driver.key} className="text-[8px] uppercase tracking-tighter text-black/40 bg-black/[0.03] px-2 py-0.5 border border-black/[0.05] font-medium">
                                                        {driver.label}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
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
                                        <div className="flex items-center gap-2">
                                            <Palette className="w-3 h-3 text-black/20" />
                                            <span className="text-[9px] uppercase text-black/40 block">Color</span>
                                        </div>
                                        <p className="text-sm font-medium uppercase tracking-tight">{data.lucky.color.label}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Hash className="w-3 h-3 text-black/20" />
                                            <span className="text-[9px] uppercase text-black/40 block">Number</span>
                                        </div>
                                        <p className="text-sm font-medium uppercase tracking-tight">{data.lucky.number}</p>
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <div className="flex items-center gap-2 justify-end">
                                            <Clock className="w-3 h-3 text-black/20" />
                                            <span className="text-[9px] uppercase text-black/40 block">Window</span>
                                        </div>
                                        <p className="text-sm font-medium uppercase tracking-tight">
                                            {typeof data.lucky.time_window === 'string'
                                                ? data.lucky.time_window
                                                : data.lucky.time_window.display}
                                        </p>
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
