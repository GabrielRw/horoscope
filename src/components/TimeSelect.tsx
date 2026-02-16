"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSelectProps {
    value: string;
    onChange: (time: string) => void;
    className?: string;
}

export function TimeSelect({ value, onChange, className }: TimeSelectProps) {
    const [displayValue, setDisplayValue] = React.useState(value || "");

    const formatAndSetTime = (input: string) => {
        // Remove non-numeric characters
        let clean = input.replace(/\D/g, "");

        // Limit to 4 digits (HHMM)
        clean = clean.slice(0, 4);

        // Apply masking: HH:MM
        let formatted = "";
        if (clean.length > 0) {
            formatted += clean.slice(0, 2);
            if (clean.length > 2) {
                formatted += ":" + clean.slice(2, 4);
            }
        }

        setDisplayValue(formatted);

        // Parse and update parent if we have a full time
        if (clean.length === 4) {
            const h = parseInt(clean.slice(0, 2));
            const m = parseInt(clean.slice(2, 4));

            if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
                const finalHour = h.toString().padStart(2, '0');
                const finalMinute = m.toString().padStart(2, '0');
                onChange(`${finalHour}:${finalMinute}`);
            }
        }
    };

    return (
        <div className={cn("relative group w-full", className)}>
            <input
                type="text"
                inputMode="numeric"
                placeholder="HH:MM"
                value={displayValue}
                onChange={(e) => formatAndSetTime(e.target.value)}
                className="w-full h-11 px-4 border border-black/10 bg-white text-sm text-center placeholder:text-black/20 focus:outline-none focus:border-black transition-colors rounded-none"
            />
        </div>
    );
}
