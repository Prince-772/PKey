"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Quote, Star, ArrowRight, ShieldCheck, Zap, Cpu } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    quote:
      "PKey has completely changed how I handle passwords. I don’t have to remember anything anymore, and everything just works seamlessly.",
    author: "Arpit Kushwaha",
    title: "Marketing Manager",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arpit&mouth=smile&top=shortFlat&clothing=overall&clothingColor=3c4f5e",
  },
  {
    quote:
      "The auto-fill and cross-device sync are insanely smooth. I can log in anywhere in seconds without worrying about security.",
    author: "Sreyash Pandey",
    title: "Software Engineer",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sreyash&mouth=default&top=shortWaved&accessories=round&clothing=hoodie",
  },
  {
    quote:
      "Strong encryption and zero stress. I finally feel confident that my credentials are safe and not exposed.",
    author: "Kishan Yadav",
    title: "Senior Security Engineer",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kishan&mouth=smile&top=shortRound&accessories=prescription02",
  },
  {
    quote:
      "The password strength meter is a game changer. No more weak passwords - everything is handled perfectly.",
    author: "Ayush Kumar",
    title: "Freelance Web Developer",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit&mouth=smile&top=shortFlat&accessories=prescription02&facialHair=beardLight&clothing=hoodie&clothingColor=262626",
  },
];

export default function Section3() {
  return (
    <section className="py-24 bg-linear-to-br from-blue-200 to-purple-200 dark:from-blue-900/40 dark:via-indigo-900/30 dark:to-purple-900/40 overflow-hidden rounded-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* --- Testimonials Header --- */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-gray-900 dark:text-white transition-colors duration-300"
          >
            Trusted by <span className="text-blue-600">Digital Nomads</span>
          </motion.h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium transition-colors duration-300">
            Join thousands of users who have upgraded their security with
            PKey&apos;s Zero-Knowledge Vault.
          </p>
        </div>

        {/* --- Testimonials Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-32">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative hover:-translate-y-3 p-8 rounded-[32px] bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-500/30 transition-all duration-300 group shadow-md hover:shadow-xl shadow-blue-800/20 dark:shadow-purple-500/20"
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-blue-500/50 group-hover:text-blue-500/70 transition-all duration-300" />

              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 font-medium italic leading-relaxed transition-colors duration-300">
                &quot;{t.quote}&quot;
              </p>

              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12">
                  <Image
                    // src={t.img}
                    src={t.img}
                    alt={t.author}
                    fill
                    sizes="48px"
                    className="object-cover rounded-full bg-blue-100 dark:bg-blue-900/30 transition-colors duration-300"
                  />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 dark:text-white leading-none mb-1 transition-colors duration-300">
                    {t.author}
                  </h4>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {t.title}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[32px] bg-linear-to-br from-blue-600 via-indigo-700 to-purple-800 p-8 md:p-16 text-center text-white shadow-2xl shadow-blue-500/20 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-400/20 blur-[100px] translate-x-1/2 translate-y-1/2 rounded-full" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Ready to Secure Your <br /> Digital Life?
            </h2>
            <p className="text-xl text-blue-100 font-medium">
              Join PKey today. It takes less than 2 minutes to set up your
              zero-knowledge vault.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link
                href="/signup"
                className="p-4 sm:px-10 sm:py-5 bg-white text-blue-700 font-black rounded-full text-sm sm:text-lg shadow-xl hover:bg-blue-50 hover:scale-105 active:scale-95 duration-300 transition-all flex items-center justify-center gap-2"
              >
                Create Free Vault <ArrowRight className="w-5 h-5 shrink-0" />
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 pt-8 opacity-70">
              <div className="flex items-center gap-2 text-sm font-bold">
                <ShieldCheck className="w-5 h-5" /> AES-256-GCM Standard
              </div>
              <div className="flex items-center gap-2 text-sm font-bold">
                <Cpu className="w-5 h-5" /> Argon2id Protected
              </div>
              <div className="flex items-center gap-2 text-sm font-bold">
                <Zap className="w-5 h-5" /> Instant Cross-Device Sync
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
