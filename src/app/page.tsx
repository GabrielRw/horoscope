"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignPicker } from "@/components/SignPicker";
import { DatePicker } from "@/components/DatePicker";
import { ZODIAC_SIGNS, type ZodiacSign } from "@/lib/signs";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BirthDetailsForm, type GeoResult, type BirthDetailsFormHandle } from "@/components/BirthDetailsForm";
import { DateChips } from "@/components/DateChips";

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
  const [date, setDate] = useState("");
  const [activeTab, setActiveTab] = useState("personalized");
  const birthFormRef = useRef<BirthDetailsFormHandle>(null);

  useEffect(() => {
    setDate(getToday());
  }, []);

  const handleGetHoroscope = useCallback(() => {
    if (!selectedSign) return;
    const params = new URLSearchParams({ date });
    router.push(`/horoscope/${selectedSign.slug}?${params.toString()}`);
  }, [selectedSign, date, router]);

  const handlePersonalizedSubmit = (details: any) => {
    const { date: birthDate, time, city, timeUnknown } = details;
    if (!city || !birthDate) return;

    const [year, month, day] = birthDate.split("-");
    const [hour, min] = time.split(":");

    const params = new URLSearchParams({
      date,
      year,
      month,
      day,
      hour,
      min,
      lat: city.lat.toString(),
      lon: city.lng.toString(),
      tzone: city.timezone,
      city: city.name,
      personalized: "true",
      timeUnknown: timeUnknown ? "true" : "false"
    });

    router.push(`/horoscope/personalized?${params.toString()}`);
  };


  return (
    <div className="relative min-h-screen bg-[#FDFDFD]">

      <div className="relative max-w-4xl mx-auto px-6 py-20">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <div className="h-px w-12 bg-black/10" />
            <div className="mx-4 text-black/20"><Sparkles className="w-4 h-4" /></div>
            <div className="h-px w-12 bg-black/10" />
          </div>
          <h1 className="text-6xl sm:text-7xl font-light tracking-tight text-black mb-6" style={{ fontFamily: "var(--font-outfit)" }}>
            Daily Horoscope
          </h1>
          <p className="text-xs uppercase tracking-[0.4em] text-black/30 font-medium">Cosmic Insights • Guided by the Stars</p>
        </motion.section>

        {/* Form Container (Card) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xl mx-auto bg-white border border-black/[0.06] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] rounded-2xl overflow-hidden mb-12"
        >
          {/* Accent Line */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />

          <div className="p-8 sm:p-12">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl p-1 bg-black/[0.03] border border-black/5 h-11 mb-12">
                <TabsTrigger
                  value="personalized"
                  className="rounded-lg text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all"
                >
                  Personalized
                </TabsTrigger>
                <TabsTrigger
                  value="sign"
                  className="rounded-lg text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all"
                >
                  Generic Sign
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personalized" className="mt-0 space-y-10">
                <BirthDetailsForm ref={birthFormRef} onSubmit={handlePersonalizedSubmit} hideCTA />

                <div className="space-y-6 pt-6 border-t border-black/5">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-widest text-black/40 text-center block">Reading Date</span>
                    <DateChips value={date} onChange={setDate} />
                  </div>
                  <div className="space-y-3 text-center">
                    <Button
                      onClick={() => {
                        birthFormRef.current?.submit();
                      }}
                      className="w-full bg-black text-white hover:bg-black/90 rounded-xl h-14 text-xs uppercase tracking-[0.2em] font-medium shadow-xl shadow-black/10"
                    >
                      See today's guidance
                    </Button>
                    <p className="text-[9px] uppercase tracking-widest text-black/30 font-medium">Takes ~3 seconds • Free Reading</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sign" className="mt-0 space-y-10">
                <SignPicker
                  selectedSign={selectedSign?.slug ?? null}
                  onSelect={setSelectedSign}
                />

                <div className="space-y-6 pt-6 border-t border-black/5">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-widest text-black/40 text-center block">Reading Date</span>
                    <DateChips value={date} onChange={setDate} />
                  </div>
                  <div className="space-y-3 text-center">
                    <Button
                      onClick={handleGetHoroscope}
                      disabled={!selectedSign}
                      className="w-full bg-black text-white hover:bg-black/90 rounded-xl h-14 text-xs uppercase tracking-[0.2em] font-medium shadow-xl shadow-black/10 disabled:opacity-30"
                    >
                      Get My Sign Reading
                    </Button>
                    <p className="text-[9px] uppercase tracking-widest text-black/30 font-medium">Takes ~1 second • Free Reading</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-8 px-4 opacity-70"
        >
          {[
            { step: "01", icon: <User className="w-3 h-3" />, title: "Personal Details", desc: "Birth time & location." },
            { step: "02", icon: <Sparkles className="w-3 h-3" />, title: "Cosmic Alignment", desc: "Real-time transits." },
            { step: "03", icon: <Search className="w-3 h-3" />, title: "Guidance", desc: "Daily focus areas." },
          ].map((item) => (
            <div key={item.step} className="space-y-2 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-[9px] font-mono text-black/40">{item.step}</span>
                <div className="text-black/30">{item.icon}</div>
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/80">{item.title}</h3>
              <p className="text-[10px] text-black/50 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </motion.section>
      </div>
    </div>
  );
}
