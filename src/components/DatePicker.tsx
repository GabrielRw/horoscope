"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    className?: string; // Add className back if needed
}

export function DatePicker({ value, onChange }: DatePickerProps) {
    // Local display state as DD/MM/YYYY
    const [displayValue, setDisplayValue] = React.useState(() => {
        if (!value) return "";
        const [y, m, d] = value.split("-");
        return `${d}/${m}/${y}`;
    });

    const formatAndSetDate = (input: string) => {
        // Remove non-numeric characters
        let clean = input.replace(/\D/g, "");

        // Limit to 8 digits (DDMMYYYY)
        clean = clean.slice(0, 8);

        // Apply masking: DD/MM/YYYY
        let formatted = "";
        if (clean.length > 0) {
            formatted += clean.slice(0, 2);
            if (clean.length > 2) {
                formatted += "/" + clean.slice(2, 4);
                if (clean.length > 4) {
                    formatted += "/" + clean.slice(4, 8);
                }
            }
        }

        setDisplayValue(formatted);

        // Parse and update parent if we have a full date
        if (clean.length === 8) {
            const d = parseInt(clean.slice(0, 2));
            const m = parseInt(clean.slice(2, 4));
            const y = parseInt(clean.slice(4, 8));

            if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1900 && y <= 2100) {
                const dateObj = new Date(y, m - 1, d);
                if (dateObj.getMonth() === m - 1 && dateObj.getDate() === d) {
                    const isoDate = `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
                    onChange(isoDate);
                }
            }
        } else if (value) {
            // Clear parent if input is incomplete/invalid
            onChange("");
        }
    };

    return (
        <div className="relative group w-full">
            <input
                type="text"
                inputMode="numeric"
                placeholder="DD/MM/YYYY"
                value={displayValue}
                onChange={(e) => formatAndSetDate(e.target.value)}
                className="w-full h-11 px-4 border border-black/10 bg-white text-sm text-center placeholder:text-black/20 focus:outline-none focus:border-black transition-colors rounded-none"
            />
        </div>
    );
}
