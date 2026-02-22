"use client";

import { useEffect, useState } from "react";
import { DatePicker } from "./DatePicker";
import { motion, AnimatePresence } from "framer-motion";

interface DateChipsProps {
    value: string;
    onChange: (date: string) => void;
}

export function DateChips({ value, onChange }: DateChipsProps) {
    const [mode, setMode] = useState<"today" | "tomorrow" | "pick">("today");

    const getToday = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    const getTomorrow = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    const today = getToday();
    const tomorrow = getTomorrow();

    useEffect(() => {
        if (value === today) setMode("today");
        else if (value === tomorrow) setMode("tomorrow");
        else if (value) setMode("pick");
    }, [value, today, tomorrow]);

    return (
        <div className="w-full flex flex-col items-center gap-4">
            <div className="flex bg-black/[0.03] p-1 border border-black/5 rounded-none w-full max-w-sm">
                {(["today", "tomorrow", "pick"] as const).map((m) => (
                    <button
                        key={m}
                        type="button"
                        onClick={() => {
                            if (m === "today") onChange(today);
                            if (m === "tomorrow") onChange(tomorrow);
                            setMode(m);
                        }}
                        className={`flex-1 py-2 text-[9px] uppercase tracking-widest transition-all ${mode === m
                                ? "bg-white text-black shadow-sm font-bold"
                                : "text-black/30 hover:text-black/50"
                            }`}
                    >
                        {m === "pick" ? "Pick a date" : m}
                    </button>
                ))}
            </div>

            <AnimatePresence>
                {mode === "pick" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="w-full max-w-[180px] overflow-hidden"
                    >
                        <DatePicker value={value} onChange={onChange} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
