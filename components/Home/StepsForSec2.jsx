import { Cpu, Database, Fingerprint, KeyRound, RefreshCcw } from "lucide-react";
import ScrollReveal from "../ScrollReveal";
import { useRef, useState, useCallback } from "react";

export default function Steps() {
  const steps = [
    {
      step: "01",
      icon: <KeyRound className="w-5 h-5 md:w-6 md:h-6" />,
      theme: "from-blue-500 to-cyan-400",
      bgLight: "bg-blue-50 dark:bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      borderGlow:
        "group-hover:border-blue-500/50 group-hover:shadow-blue-500/20",
      title: "Master Password",
      desc: "You type it in and it stays on your device. It never goes anywhere else.",
    },
    {
      step: "02",
      icon: <Cpu className="w-5 h-5 md:w-6 md:h-6" />,
      theme: "from-orange-500 to-amber-400",
      bgLight: "bg-orange-50 dark:bg-orange-500/10",
      text: "text-orange-600 dark:text-orange-400",
      borderGlow:
        "group-hover:border-orange-500/50 group-hover:shadow-orange-500/20",
      title: "Argon2id Hash",
      desc: "A heavy-duty algorithm stretches your password into an ultra-strong cryptographic key.",
    },
    {
      step: "03",
      icon: <Fingerprint className="w-5 h-5 md:w-6 md:h-6" />,
      theme: "from-rose-500 to-pink-400",
      bgLight: "bg-rose-50 dark:bg-rose-500/10",
      text: "text-rose-600 dark:text-rose-400",
      borderGlow:
        "group-hover:border-rose-500/50 group-hover:shadow-rose-500/20",
      title: "HKDF Key Split",
      desc: "Your main key splits into two distinct keys, one for authentication and one for encryption.",
    },
    {
      step: "04",
      icon: <Database className="w-5 h-5 md:w-6 md:h-6" />,
      theme: "from-emerald-500 to-teal-400",
      bgLight: "bg-emerald-50 dark:bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      borderGlow:
        "group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/20",
      title: "AES-256-GCM",
      desc: "Your data gets locked down with military-grade encryption that makes it completely tamper-proof.",
    },
    {
      step: "05",
      icon: <RefreshCcw className="w-5 h-5 md:w-6 md:h-6" />,
      theme: "from-indigo-500 to-violet-400",
      bgLight: "bg-indigo-50 dark:bg-indigo-500/10",
      text: "text-indigo-600 dark:text-indigo-400",
      borderGlow:
        "group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/20",
      title: "Cloud Sync",
      desc: "Only the encrypted ciphertext safely syncs to the cloud. It is totally unreadable without your key.",
    },
  ];
  const scrollRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 220 + 20; // w-[220px] + gap-5
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveStep(Math.min(index, steps.length - 1));
  }, [steps.length]);


  return (
    <>
      {/* ══════════════════════════════════════════════
      DESKTOP (>=1024px) — grid with connecting line
      ══════════════════════════════════════════════ */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-6 relative z-10">
        {/* Connecting line — wider, more prominent */}
        <div className="absolute top-[40px] left-[8%] right-[8%] h-0.5 bg-linear-to-r from-blue-500 via-red-300  dark:via-red-600 to-violet-500 z-0 pointer-events-none shadow-sm" />

        {steps.map((s, i) => (
          <div
            key={s.step}
            className="group flex flex-col items-center gap-4 relative z-10"
          >
            {/* Icon node */}
            <ScrollReveal direction="up" delayMs={i * 100}>
              <div className="relative shrink-0">
                <div
                  className={`absolute inset-0 rounded-full bg-linear-to-tr ${s.theme} opacity-20 group-hover:opacity-60 group-hover:animate-ping transition-opacity duration-500`}
                />
                <div
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-white dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:border-transparent`}
                >
                  <div
                    className={`absolute inset-0 rounded-full bg-linear-to-tr ${s.theme} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                  <div className={`${s.text} transition-colors duration-300`}>
                    {s.icon}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Card */}
            <ScrollReveal
              direction="up"
              delayMs={i * 100 + 50}
              className="flex-1 w-full"
            >
              <div
                className={`relative w-full h-full p-5 rounded-2xl bg-white dark:bg-gray-900/50 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300 text-center overflow-hidden hover:-translate-y-1 hover:shadow-2xl ${s.borderGlow}`}
              >
                <div
                  className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-linear-to-tr ${s.theme}`}
                />
                <div className="relative z-10">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-3 ${s.bgLight} ${s.text}`}
                  >
                    Step {s.step}
                  </span>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white leading-tight mb-2">
                    {s.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                    {s.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════
      TABLET (768-1023px) — horizontal snap scroll with connecting line
      ══════════════════════════════════════════════ */}
      <div className="hidden md:block lg:hidden relative">
        {/* Tablet connecting line — visible, positioned behind cards */}
        <div className="absolute top-18 left-24 right-24 h-0.5 bg-linear-to-r from-blue-500 via-red-300  dark:via-red-600 to-violet-500 z-0 pointer-events-none shadow-sm" />
        
        <div 
          ref={scrollRef} 
          onScroll={handleScroll} 
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-bar-hide -mx-4 px-4 relative z-10 pt-10"
        >
          {steps.map((s, i) => (
            <div
              key={s.step}
              className="snap-center shrink-0 w-55 group flex flex-col items-center gap-4"
              tabIndex={0}
            >
              {/* Icon node */}
              <ScrollReveal direction="up" delayMs={i * 80}>
                <div className="relative shrink-0">
                  <div
                    className={`absolute inset-0 rounded-full bg-linear-to-tr ${s.theme} opacity-20 group-hover:opacity-60 group-hover:animate-ping group-focus-within:animate-ping transition-opacity duration-500`}
                  />
                  <div
                    className={`relative w-16 h-16 rounded-full flex items-center justify-center bg-white dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:border-transparent`}
                  >
                    <div
                      className={`absolute inset-0 rounded-full bg-linear-to-tr ${s.theme} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    <div className={`${s.text} transition-colors duration-300`}>
                      {s.icon}
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Card */}
              <ScrollReveal
                direction="up"
                delayMs={i * 80 + 40}
                className="w-full"
              >
                <div
                  className={`relative w-full p-5 rounded-2xl bg-white dark:bg-gray-900/50 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300 text-center overflow-hidden hover:-translate-y-1 hover:shadow-xl ${s.borderGlow}`}
                >
                  <div
                    className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-linear-to-tr ${s.theme}`}
                  />
                  <div className="relative z-10">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-3 ${s.bgLight} ${s.text}`}
                    >
                      Step {s.step}
                    </span>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white leading-tight mb-2">
                      {s.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>

        {/* Tablet scroll hint — limited to 3 dots */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="flex gap-2">
            {[0,1,2].map((stepIndex) => (
              <div
                key={stepIndex}
                className={`rounded-full transition-all duration-300 ${
                  stepIndex === activeStep
                    ? "w-5 h-1.5 bg-blue-500 dark:bg-blue-400"
                    : "w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
      MOBILE (<768px) — vertical stack with connecting line
      ══════════════════════════════════════════════ */}
      <div className="flex flex-col gap-5 md:hidden relative">
        {/* Mobile connecting line — vertical line along the left side */}
        <div className="absolute left-[23px] top-10 bottom-10 w-0.5 bg-linear-to-b from-blue-500 via-red-300  dark:via-red-600 to-violet-500 z-0 pointer-events-none shadow-sm" />
        
        {steps.map((s, i) => (
          <div key={s.step} className="group flex flex-row gap-4 items-center relative z-10" tabIndex={0}>
            {/* Icon */}
            <ScrollReveal direction="up" delayMs={i * 80}>
              <div className="relative shrink-0">
                <div
                  className={`absolute inset-0 rounded-full bg-linear-to-tr ${s.theme} opacity-20 group-hover:opacity-60 group-hover:animate-ping group-focus-within:animate-ping transition-opacity duration-500`}
                />
                <div
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 shadow-lg transition-transform duration-500 group-hover:scale-110`}
                >
                  <div className={`${s.text} transition-colors duration-300`}>
                    {s.icon}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Card */}
            <ScrollReveal
              direction="right"
              delayMs={i * 80 + 40}
              className="flex-1"
            >
              <div
                className={`relative w-full p-4 rounded-2xl bg-white dark:bg-gray-900/50 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300 overflow-hidden ${s.borderGlow}`}
              >
                <div className="relative z-10">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 ${s.bgLight} ${s.text}`}
                  >
                    Step {s.step}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-1">
                    {s.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                    {s.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        ))}
      </div>
    </>
  );
}