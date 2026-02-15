"use client";

import { ZODIAC_SIGNS, type ZodiacSign } from "@/lib/signs";
import { motion } from "framer-motion";

interface SignPickerProps {
    selectedSign: string | null;
    onSelect: (sign: ZodiacSign) => void;
}

export function SignPicker({ selectedSign, onSelect }: SignPickerProps) {
    return (
        <div
            className="grid grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-black/10"
            role="radiogroup"
            aria-label="Select your zodiac sign"
        >
            {ZODIAC_SIGNS.map((sign, index) => {
                const isSelected = selectedSign === sign.slug;

                return (
                    <motion.button
                        key={sign.slug}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02, duration: 0.4 }}
                        onClick={() => onSelect(sign)}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${sign.name} — ${sign.dateRange}`}
                        className={`
              relative flex flex-col items-center gap-6 p-10 lg:p-14
              border-r border-b border-black/10 transition-all duration-200 cursor-pointer
              group hover:bg-black/5
              ${isSelected ? "bg-black text-white hover:bg-black" : "bg-transparent text-black"}
            `}
                    >
                        <span className={`text-6xl leading-none select-none font-astro transition-colors duration-200 ${isSelected ? "text-white" : "text-black"}`} aria-hidden="true">
                            {sign.fontChar}
                        </span>
                        <div className="flex flex-col items-center gap-3">
                            <span className={`text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-200 ${isSelected ? "text-white" : "text-black text-center"}`}>
                                {sign.name}
                            </span>
                            <span className={`text-[10px] uppercase tracking-wider transition-colors duration-200 ${isSelected ? "text-white/60" : "text-black/30 text-center"}`}>
                                {sign.dateRange}
                            </span>
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}
