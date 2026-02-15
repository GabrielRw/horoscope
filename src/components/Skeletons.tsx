"use client";

import { motion } from "framer-motion";

export function HoroscopeSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black/10" />
                <div className="space-y-2">
                    <div className="h-5 w-32 rounded bg-black/10" />
                    <div className="h-3 w-48 rounded bg-black/5" />
                </div>
            </div>

            {/* Badges */}
            <div className="flex gap-2">
                <div className="h-6 w-20 rounded-full bg-black/10" />
                <div className="h-6 w-16 rounded-full bg-black/5" />
                <div className="h-6 w-24 rounded-full bg-black/5" />
            </div>

            {/* Reading Card */}
            <div className="p-6 rounded-2xl bg-black/[0.03] border border-black/[0.06] space-y-3">
                <div className="h-3 w-full rounded bg-black/10" />
                <div className="h-3 w-11/12 rounded bg-black/5" />
                <div className="h-3 w-9/12 rounded bg-black/5" />
                <div className="h-3 w-10/12 rounded bg-black/5" />
            </div>

            {/* Tabs skeleton */}
            <div className="h-10 rounded-xl bg-black/5 w-full" />
            <div className="p-5 rounded-2xl bg-black/[0.03] border border-black/[0.06] space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded bg-black/10" />
                        <div className="w-16 h-3 rounded bg-black/10" />
                        <div className="flex-1 h-2 rounded-full bg-black/5" />
                        <div className="w-8 h-3 rounded bg-black/10" />
                    </div>
                ))}
            </div>
        </div>
    );
}

import { Loader2 } from "lucide-react";

export function LoadingOverlay() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
        >
            <Loader2 className="h-8 w-8 animate-spin text-black/80" />
            <p className="text-black/50 text-xs uppercase tracking-widest">Tuning in…</p>
        </motion.div>
    );
}
