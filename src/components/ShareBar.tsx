"use client";

import { Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ShareBarProps {
    sign: string;
    date: string;
}

export function ShareBar({ sign, date }: ShareBarProps) {
    const [copied, setCopied] = useState(false);

    const url = typeof window !== "undefined"
        ? `${window.location.origin}/horoscope/${sign}?date=${date}`
        : "";

    const shareText = `Check out today's ${sign.charAt(0).toUpperCase() + sign.slice(1)} horoscope ✨`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback: do nothing
        }
    };

    const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="bg-black/5 border-black/10 text-black/70 hover:bg-black/10 hover:text-black gap-2"
            >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy Link"}
            </Button>
            <Button
                variant="outline"
                size="sm"
                asChild
                className="bg-black/5 border-black/10 text-black/70 hover:bg-black/10 hover:text-black gap-2"
            >
                <a href={xUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Share on X
                </a>
            </Button>
            <Button
                variant="outline"
                size="sm"
                asChild
                className="bg-black/5 border-black/10 text-black/70 hover:bg-black/10 hover:text-black gap-2"
            >
                <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Telegram
                </a>
            </Button>
        </div>
    );
}
