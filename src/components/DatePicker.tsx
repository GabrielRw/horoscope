"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    className?: string;
}

export function DatePicker({ value, onChange, className }: DatePickerProps) {
    // Determine display text
    const displayValue = value ? format(new Date(value), "PPP") : "Pick a date";

    return (
        <div className={cn("relative group w-full", className)}>
            <div className={cn(
                "flex items-center w-full px-4 h-11 border border-black/10 bg-white text-sm transition-colors group-hover:bg-black/[0.02]",
                !value && "text-black/40"
            )}>
                <CalendarDays className="mr-3 h-4 w-4 opacity-40" />
                <span className="flex-1 font-light tracking-wide truncate">
                    {displayValue}
                </span>
            </div>
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onClick={(e) => {
                    try {
                        (e.target as HTMLInputElement).showPicker?.();
                    } catch (error) {
                        // Fallback or ignore if not supported/allowed
                    }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full accent-black [color-scheme:light]"
                aria-label="Pick a date"
            />
        </div>
    );
}
