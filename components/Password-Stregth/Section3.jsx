"use client";
import ScrollReveal from '@/components/ScrollReveal';
import React from "react";

import { ServerOff, WifiOff, ShieldCheck } from "lucide-react";

export default function Section3() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 text-white shadow-2xl border border-gray-800">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 p-6 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12">
            
            <div className="lg:w-1/2 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/80 border border-gray-700 text-emerald-400 text-sm font-bold shadow-sm backdrop-blur-md">
                <ShieldCheck className="w-4 h-4" /> Zero-Knowledge Proof
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Wait, did you just save my password?
              </h2>
              
              <p className="text-2xl font-bold text-emerald-400">
                Absolutely Not.
              </p>
              
              <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
                This strength checker is powered by <span className="text-blue-400">zxcvbn</span> and runs entirely in your browser. Your keystrokes never leave your device.
              </p>
            </div>

            <div className="lg:w-1/2 flex flex-col gap-5 w-full max-w-md">
              <ScrollReveal direction='up'>
                <div className="group flex items-start gap-3 md:gap-5 p-3 md:p-6 rounded-3xl bg-gray-800/50 border-2 border-blue-700/50 hover:bg-gray-800 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center shrink-0 text-blue-400 group-hover:scale-110 transition-transform">
                    <ServerOff className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-100 mb-1">No Server Logs</h4>
                    <p className="text-gray-400 text-sm font-medium">We don&apos;t have a database attached to this tool. There is nowhere for your password to be sent.</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction='up' delayMs={200}>
                <div className="group flex items-start gap-3 md:gap-5 p-3 md:p-6 rounded-3xl bg-gray-800/50 border-2 border-emerald-700/50 hover:bg-gray-800 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center shrink-0 text-emerald-400 group-hover:scale-110 transition-transform">
                    <WifiOff className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-100 mb-1">Try the Offline Test</h4>
                    <p className="text-gray-400 text-sm font-medium">Don&apos;t trust us? Disconnect your device from Wi-Fi right now. This tool will continue to work perfectly.</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}