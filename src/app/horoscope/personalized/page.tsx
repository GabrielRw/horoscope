"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonalizedReading } from "@/components/PersonalizedReading";
import { LoadingOverlay } from "@/components/Skeletons";
import { ErrorState } from "@/components/ErrorState";
import { fetchHoroscope, type BirthDetails } from "@/lib/astroapi";
import type { HoroscopeData } from "@/lib/validators";

function PersonalizedResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [data, setData] = useState<HoroscopeData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const day = searchParams.get("day");
    const hour = searchParams.get("hour");
    const min = searchParams.get("min");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const tzone = searchParams.get("tzone");
    const city = searchParams.get("city");
    const targetDate = searchParams.get("date") || "today";

    const loadHoroscope = useCallback(async () => {
        if (!year || !month || !day || !lat || !lon) {
            setError("Missing birth details for personalized reading.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const birth: BirthDetails = {
            year: parseInt(year),
            month: parseInt(month),
            day: parseInt(day),
            hour: parseInt(hour || "12"),
            minute: parseInt(min || "0"),
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            tzone: 0,
            city: city || "Unknown",
        };

        const result = await fetchHoroscope({ birth, date: targetDate });

        if ("error" in result && result.error) {
            setError(result.error);
        } else if ("data" in result && result.data) {
            setData(result.data);
        }

        setLoading(false);
    }, [year, month, day, hour, min, lat, lon, city, targetDate]);

    useEffect(() => {
        loadHoroscope();
    }, [loadHoroscope]);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
            {/* Top Bar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-20 flex-wrap gap-4"
            >
                <Link href="/">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-black/40 hover:text-black hover:bg-black/5 gap-2 -ml-2 rounded-none uppercase text-[10px] tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Search
                    </Button>
                </Link>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 border border-black/5 text-[10px] text-black/40 uppercase tracking-widest">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {targetDate}
                    </div>
                    {city && (
                        <div className="flex items-center gap-2 px-3 py-1.5 border border-black/5 text-[10px] text-black/40 uppercase tracking-widest">
                            <MapPin className="w-3.5 h-3.5" />
                            {city}
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
                    <PersonalizedReading data={data} />


                    {/* Return Link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 }}
                        className="mt-16 text-center border-t border-black/5 pt-12"
                    >
                        <Button
                            variant="outline"
                            className="border-black/20 text-black hover:bg-black/5 rounded-none px-12 h-12 text-xs uppercase tracking-widest"
                            onClick={() => router.push("/")}
                        >
                            Change Birth Details
                        </Button>
                    </motion.div>
                </>
            )}
        </div>
    );
}

export default function PersonalizedResultPage() {
    return (
        <Suspense fallback={<LoadingOverlay />}>
            <PersonalizedResultContent />
        </Suspense>
    );
}
