"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Search, Loader2, MapPin, CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "./DatePicker";
import { TimeSelect } from "./TimeSelect";
import { motion, AnimatePresence } from "framer-motion";

export interface GeoResult {
    name: string;
    country: string;
    lat: number;
    lng: number;
    timezone: string;
}

interface BirthDetails {
    date: string;
    time: string;
    city: GeoResult | null;
    timeUnknown?: boolean;
}

interface BirthDetailsFormProps {
    onSubmit: (details: BirthDetails) => void;
    hideCTA?: boolean;
}

export interface BirthDetailsFormHandle {
    submit: () => void;
}

export const BirthDetailsForm = forwardRef<BirthDetailsFormHandle, BirthDetailsFormProps>(
    ({ onSubmit, hideCTA }, ref) => {
        const [details, setDetails] = useState<BirthDetails>({
            date: "",
            time: "12:00",
            city: null,
            timeUnknown: false,
        });

        const [query, setQuery] = useState("");
        const [results, setResults] = useState<GeoResult[]>([]);
        const [searching, setSearching] = useState(false);
        const [showResults, setShowResults] = useState(false);
        const resultsRef = useRef<HTMLDivElement>(null);

        // Load from localStorage
        useEffect(() => {
            const saved = localStorage.getItem("birth_details");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setDetails(parsed);
                    if (parsed.city) setQuery(parsed.city.name);
                } catch (e) {
                    console.error("Failed to parse birth details", e);
                }
            }
        }, []);


        const searchCities = async (q: string) => {
            console.log("[BirthDetailsForm] searchCities called with:", q);
            if (!q || q.length < 2) {
                setResults([]);
                return;
            }
            setSearching(true);
            try {
                console.log("[BirthDetailsForm] Fetching /api/geo...");
                const res = await fetch(`/api/geo?q=${encodeURIComponent(q)}`);
                const data = await res.json();
                console.log("[BirthDetailsForm] Fetch results:", data);
                setResults(data.results || []);
                setShowResults(true);
            } catch (error) {
                console.error("[BirthDetailsForm] Search error", error);
            } finally {
                setSearching(false);
            }
        };

        // Debounce search
        useEffect(() => {
            const timer = setTimeout(() => {
                if (query && (!details.city || query !== details.city.name)) {
                    searchCities(query);
                }
            }, 500);
            return () => clearTimeout(timer);
        }, [query]);

        // Close results when clicking outside
        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (resultsRef.current && !resultsRef.current.contains(e.target as Node)) {
                    setShowResults(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        const handleSelectCity = (city: GeoResult) => {
            setDetails(prev => ({ ...prev, city }));
            setQuery(city.name);
            setShowResults(false);
            // We will save to localStorage in handleSubmit or effectively on state change if we wanted
        };

        useImperativeHandle(ref, () => ({
            submit: handleSubmit
        }));

        const handleSubmit = (e?: React.FormEvent) => {
            if (e) e.preventDefault();
            if (!details.date || !details.city) return;
            localStorage.setItem("birth_details", JSON.stringify(details));
            onSubmit(details);
        };

        return (
            <form
                onSubmit={handleSubmit}
                className="w-full space-y-8 max-w-md mx-auto"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* DATE INPUT */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-xs uppercase tracking-widest text-black/60 font-light">
                            <CalendarDays className="w-3 h-3 opacity-40" />
                            Birth Date
                        </Label>
                        <DatePicker
                            value={details.date}
                            onChange={(date) => setDetails(prev => ({ ...prev, date }))}
                        />
                    </div>

                    {/* TIME INPUT */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2 text-xs uppercase tracking-widest text-black/60">
                                <Clock className="w-3 h-3" />
                                Birth Time
                            </Label>
                            <button
                                type="button"
                                onClick={() => {
                                    const newUnknown = !details.timeUnknown;
                                    setDetails(prev => ({
                                        ...prev,
                                        timeUnknown: newUnknown,
                                        time: newUnknown ? "12:00" : prev.time
                                    }));
                                }}
                                className={`text-[9px] uppercase tracking-tighter transition-colors ${details.timeUnknown ? "text-black font-bold" : "text-black/30 hover:text-black/50"}`}
                            >
                                {details.timeUnknown ? "Time unknown ✓" : "I don't know my time"}
                            </button>
                        </div>
                        <div className={details.timeUnknown ? "opacity-30 pointer-events-none" : ""}>
                            <TimeSelect
                                value={details.time}
                                onChange={(time) => setDetails(prev => ({ ...prev, time }))}
                            />
                        </div>
                    </div>
                </div>

                {details.timeUnknown && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] text-black/40 italic leading-relaxed"
                    >
                        Note: Accuracy for houses and ascendant will be limited. We'll use 12:00 PM (Noon) as a default.
                    </motion.p>
                )}

                {/* CITY SEARCH */}
                <div className="space-y-2 relative">
                    <Label htmlFor="city-search" className="flex items-center gap-2 text-xs uppercase tracking-widest text-black/60">
                        <MapPin className="w-3 h-3" />
                        Birth City
                    </Label>
                    <div className="relative">
                        <Input
                            id="city-search"
                            placeholder="Search for place..."
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                if (details.city) setDetails(prev => ({ ...prev, city: null }));
                            }}
                            className="rounded-none pr-10 border-black/10 focus:border-black h-11"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {searching ? (
                                <Loader2 className="w-4 h-4 animate-spin text-black/40" />
                            ) : (
                                <Search className="w-4 h-4 text-black/20" />
                            )}
                        </div>
                    </div>

                    <AnimatePresence>
                        {showResults && results.length > 0 && (
                            <motion.div
                                ref={resultsRef}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-50 w-full bg-white border border-black/10 mt-1 shadow-lg max-h-60 overflow-auto"
                            >
                                {results.map((result, i) => (
                                    <button
                                        key={`${result.lat}-${result.lng}-${i}`}
                                        onClick={() => handleSelectCity(result)}
                                        className="w-full px-4 py-3 text-left text-xs hover:bg-black/[0.02] border-b border-black/[0.05] last:border-0 transition-colors flex items-center justify-between group"
                                    >
                                        <div>
                                            <span className="text-black font-medium block">{result.name}</span>
                                            <span className="text-black/40 uppercase tracking-tighter">{result.country} • {result.timezone}</span>
                                        </div>
                                        <MapPin className="w-3 h-3 text-black/10 group-hover:text-black/40 transition-colors" />
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {!hideCTA && (
                    <div className="space-y-3">
                        <Button
                            onClick={handleSubmit}
                            type="submit"
                            disabled={!details.date || !details.city}
                            className="w-full bg-black text-white hover:bg-black/90 rounded-none h-12 text-xs uppercase tracking-[0.2em] font-light shadow-2xl shadow-black/10"
                        >
                            See today's guidance
                        </Button>
                        <p className="text-[9px] text-center uppercase tracking-widest text-black/30 font-medium">
                            Takes ~3 seconds • Free Reading
                        </p>
                    </div>
                )}
            </form>
        );
    }
);

BirthDetailsForm.displayName = "BirthDetailsForm";
