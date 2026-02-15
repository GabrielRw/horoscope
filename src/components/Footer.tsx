export function Footer() {
    return (
        <footer className="w-full border-t border-black/[0.06] mt-auto">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-4 text-center">
                <p className="text-[10px] text-black/20 uppercase tracking-widest leading-relaxed max-w-md mx-auto">
                    Horoscope readings are for entertainment purposes only. Not intended as
                    medical, legal, or financial advice.
                </p>
                <div className="pt-2">
                    <p className="text-[10px] text-black/20 uppercase tracking-widest">
                        Powered by{" "}
                        <a
                            href="https://www.freeastroapi.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black/40 hover:text-black transition-colors underline underline-offset-4 decoration-black/20 hover:decoration-black/50"
                        >
                            FreeAstroAPI
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
