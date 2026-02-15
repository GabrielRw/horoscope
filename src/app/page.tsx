"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignPicker } from "@/components/SignPicker";
import { DatePicker } from "@/components/DatePicker";
import { ZODIAC_SIGNS, type ZodiacSign } from "@/lib/signs";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BirthDetailsForm, type GeoResult } from "@/components/BirthDetailsForm";

function getToday(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function HomePage() {
  const router = useRouter();
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [date, setDate] = useState(getToday());
  const [activeTab, setActiveTab] = useState("personalized");

  const handleGetHoroscope = useCallback(() => {
    if (!selectedSign) return;
    const params = new URLSearchParams({ date });
    router.push(`/horoscope/${selectedSign.slug}?${params.toString()}`);
  }, [selectedSign, date, router]);

  const handlePersonalizedSubmit = (details: any) => {
    const { date: birthDate, time, city } = details;
    if (!city || !birthDate) return;

    const [year, month, day] = birthDate.split("-");
    const [hour, min] = time.split(":");

    const params = new URLSearchParams({
      date, // Target date for horoscope
      year,
      month,
      day,
      hour,
      min,
      lat: city.lat.toString(),
      lon: city.lng.toString(),
      tzone: city.timezone, // FreeAstroAPI endpoint might want tzone as number or string, I'll pass timezone str and handle in route
      city: city.name,
      personalized: "true"
    });

    router.push(`/horoscope/personalized?${params.toString()}`);
  };


  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl sm:text-7xl font-light tracking-tight text-black mb-6" style={{ fontFamily: "var(--font-outfit)" }}>
          Daily Horoscope
        </h1>

      </motion.section>

      {/* Mode Switcher */}
      <div className="flex justify-center mb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl">
          <TabsList className="grid w-full grid-cols-2 rounded-none p-1 bg-black/[0.03] border border-black/5 h-12">
            <TabsTrigger
              value="personalized"
              className="rounded-none text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:text-black transition-all"
            >
              Personalized
            </TabsTrigger>
            <TabsTrigger
              value="sign"
              className="rounded-none text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:text-black transition-all"
            >
              Generic Sign
            </TabsTrigger>
          </TabsList>

          <div className="mt-12">
            <TabsContent value="personalized" className="mt-0">
              <BirthDetailsForm onSubmit={handlePersonalizedSubmit} />
            </TabsContent>

            <TabsContent value="sign" className="mt-0">
              <div className="space-y-12">
                <SignPicker
                  selectedSign={selectedSign?.slug ?? null}
                  onSelect={setSelectedSign}
                />

                <div className="flex flex-col items-center justify-center gap-6 border-t border-black/5 pt-10">
                  <div className="flex flex-col gap-2 items-center">
                    <span className="text-[10px] uppercase tracking-widest text-black/40">Reading Date</span>
                    <DatePicker value={date} onChange={setDate} className="w-full" />
                  </div>

                  <Button
                    onClick={handleGetHoroscope}
                    disabled={!selectedSign}
                    size="lg"
                    className="bg-black text-white hover:bg-black/80 rounded-none px-10 h-12 text-xs uppercase tracking-widest disabled:opacity-50 w-full max-w-xs"
                  >
                    Read My Sign
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Date for Personalized (Shared if needed, but form has its own dob. We need target date) */}
      {activeTab === "personalized" && (
        <div className="flex flex-col items-center justify-center gap-2 mb-20">
          <span className="text-[10px] uppercase tracking-widest text-black/40">Target Reading Date</span>
          <DatePicker value={date} onChange={setDate} className="max-w-xs mx-auto" />
        </div>
      )}

      {/* How it works */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mb-20 grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-black/10"
      >
        {[
          { step: "01", title: "Personal Details", desc: "Enter your birth time and location for depth." },
          { step: "02", title: "Cosmic Alignment", desc: "We calculate real-time transits to your natal chart." },
          { step: "03", title: "Guidance", desc: "Receive unique daily focus areas and insights." },
        ].map((item) => (
          <div
            key={item.step}
            className="space-y-3 text-center md:text-left"
          >
            <span className="text-xs font-mono text-black/30 block mb-2">{item.step}</span>
            <h3 className="text-lg font-light text-black">{item.title}</h3>
            <p className="text-sm text-black/50 leading-relaxed max-w-xs mx-auto md:mx-0">{item.desc}</p>
          </div>
        ))}
      </motion.section>


    </div>
  );
}
