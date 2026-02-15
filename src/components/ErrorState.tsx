"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({
    message = "We couldn't load today's reading. Try again.",
    onRetry,
}: ErrorStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 gap-4 text-center"
        >
            <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
            <p className="text-black/70 text-sm max-w-xs leading-relaxed">{message}</p>
            {onRetry && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="bg-black/5 border-black/10 text-black/70 hover:bg-black/10 hover:text-black gap-2 mt-2"
                >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    Try Again
                </Button>
            )}
        </motion.div>
    );
}
