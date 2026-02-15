"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoroscopeCard } from "@/components/HoroscopeCard";
import { ShareBar } from "@/components/ShareBar";
import { LoadingOverlay } from "@/components/Skeletons";
import { ErrorState } from "@/components/ErrorState";
import { fetchHoroscope } from "@/lib/astroapi";
import { isValidSign, getSign } from "@/lib/signs";
import type { HoroscopeData } from "@/lib/validators";

function getToday(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function HoroscopeResultPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const sign = (params.sign as string)?.toLowerCase() ?? "";
    const date = searchParams.get("date") || getToday();
    const tone = searchParams.get("tone") || "practical";

    const [data, setData] = useState<HoroscopeData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const loadHoroscope = useCallback(async () => {
        setLoading(true);
        setError(null);
        setData(null);

        if (!isValidSign(sign)) {
            setError(`"${sign}" is not a valid zodiac sign.`);
            setLoading(false);
            return;
        }

        const result = await fetchHoroscope({ sign, date });

        if ("error" in result && result.error) {
            setError(result.error);
        } else if ("data" in result && result.data) {
            setData(result.data);
        }

        setLoading(false);
    }, [sign, date]);

    useEffect(() => {
        loadHoroscope();
    }, [loadHoroscope]);

    const signData = getSign(sign);

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
            {/* Top Bar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8 flex-wrap gap-4"
            >
                <Link href="/">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-black/50 hover:text-black hover:bg-black/5 gap-2 -ml-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                </Link>

                <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-none border border-black/10 text-[10px] text-black/40 uppercase tracking-widest">
                        {date}
                    </div>
                    {tone !== "practical" && (
                        <div className="px-3 py-1.5 rounded-none border border-black/10 text-[10px] text-black/40 uppercase tracking-widest">
                            {tone}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Content */}
            {loading && <LoadingOverlay />}

            {error && !loading && (
                <ErrorState message={error} onRetry={loadHoroscope} />
            )}

            {data && !loading && !error && (
                <>
                    <HoroscopeCard data={data} />

                    {/* Share Bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-8 pt-6 border-t border-black/[0.06]"
                    >
                        <p className="text-xs text-black/30 mb-3 tracking-wide">Share this reading</p>
                        <ShareBar sign={sign} date={date} />
                    </motion.div>

                    {/* Change sign/date controls */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 }}
                        className="mt-8 flex items-center gap-3 flex-wrap"
                    >
                        <span className="text-xs text-black/30">Quick nav:</span>
                        {signData && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-black/40 hover:text-black/70 text-xs"
                                    onClick={() => {
                                        const idx = (["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"].indexOf(sign) + 1) % 12;
                                        const nextSign = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"][idx];
                                        router.push(`/horoscope/${nextSign}?date=${date}&tone=${tone}`);
                                    }}
                                >
                                    Next sign →
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-black/40 hover:text-black/70 text-xs"
                                    onClick={() => router.push("/")}
                                >
                                    Change sign/date
                                </Button>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </div>
    );
}
