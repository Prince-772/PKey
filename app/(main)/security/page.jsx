"use client";
import ScrollReveal from "@/components/ScrollReveal";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";

import {
  KeyRound,
  CloudOff,
  Timer,
  AlertTriangle,
  ShieldCheck,
  Code,
  ArrowLeft,
  ChevronRight,
  UserX,
  Cpu,
  Smartphone,
  ShieldAlert,
  EyeOff,
  Lock,
  GlobeLock,
  Menu,
  X,
  Zap,
  GitMerge,
} from "lucide-react";

import Footer from "@/components/Footer";
import { BackToHomeBtn } from "@/components/backToHomeBtn";

export default function SecurityPage() {
  const sections = useMemo(
    () => [
      {
        id: "definition",

        icon: <KeyRound className="w-6 h-6 text-blue-500" />,

        title: "What is the Master Password?",
        content: (
          <>
            The Master Password is your{" "}
            <span className="font-bold text-emerald-500">
              unique cryptographic key
            </span>
            . It serves as the primary seed to{" "}
            <span className="font-bold text-emerald-500">
              encrypt and decrypt your sensitive data locally
            </span>
            . PKey follows a strict{" "}
            <span className="font-bold text-emerald-500">
              zero-knowledge protocol
            </span>
            : we{" "}
            <span className="font-bold text-red-500">
              never store, transmit, or have access
            </span>{" "}
            to this password.
          </>
        ),
      },

      {
        id: "storage",

        icon: <CloudOff className="w-6 h-6 text-red-500" />,

        title: "Is it stored on your servers?",
        content: (
          <>
            {" "}
            <span className="font-bold text-red-500">No</span>. We only store a{" "}
            <span className="font-bold text-emerald-500">
              non-reversible cryptographic hash
            </span>{" "}
            of your Master Password for authentication purposes. The raw
            password is{" "}
            <span className="font-bold text-red-500">
              never saved in any database
            </span>
            , ensuring that even in the event of a{" "}
            <span className="font-bold text-amber-500">server breach</span>,
            your actual key remains{" "}
            <span className="font-bold text-emerald-500">unknown</span>.
          </>
        ),
      },

      {
        id: "usage",
        icon: <GlobeLock className="w-6 h-6 text-emerald-500" />,
        title: "How is the encryption handled?",
        content: (
          <>
            PKey utilizes{" "}
            <span className="font-bold text-emerald-500">
              client-side encryption
            </span>
            . This means the heavy lifting of securing your data happens{" "}
            <span className="font-bold text-emerald-500">
              directly in your browser using the AES-256-GCM standard via
              WebAssembly
            </span>
            . Your data is{" "}
            <span className="font-bold text-emerald-500">
              encrypted before it ever leaves your device
            </span>
            .
          </>
        ),
      },

      {
        id: "security",

        icon: <Timer className="w-6 h-6 text-orange-500" />,

        title: "Session Security & Persistence",
        content: (
          <>
            For your protection, the Master Password is held only in{" "}
            <span className="font-bold text-emerald-500">
              volatile memory (RAM)
            </span>
            . To prevent unauthorized access, the session{" "}
            <span className="font-bold text-amber-500">
              automatically expires after 5 minutes of inactivity
            </span>
            , requiring re-entry to unlock the vault.
          </>
        ),
      },
      {
        id: "argon2",
        icon: <Zap className="w-6 h-6 text-orange-500" />,
        title: "Why Argon2id over standard hashing?",
        content: (
          <>
            Unlike standard hashing algorithms,{" "}
            <span className="font-bold text-emerald-500">
              Argon2id is memory-hard
            </span>
            . It actively consumes device RAM during key derivation, which
            effectively{" "}
            <span className="font-bold text-emerald-500">
              neutralizes botnets and GPU farms
            </span>{" "}
            from attempting to crack your Master Password.
          </>
        ),
      },

      {
        id: "hkdf",
        icon: <GitMerge className="w-6 h-6 text-purple-500" />,
        title: "How is my Master Key protected?",
        content: (
          <>
            PKey uses the{" "}
            <span className="font-bold text-emerald-500">
              HKDF (HMAC-based Key Derivation Function) protocol
            </span>
            . Your master key is cryptographically split into{" "}
            <span className="font-bold text-emerald-500">
              two completely isolated keys
            </span>
            —one strictly for authentication and one strictly for
            encryption—ensuring{" "}
            <span className="font-bold text-emerald-500">
              maximum architectural security
            </span>
            .
          </>
        ),
      },

      {
        id: "recovery",

        icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,

        title: "What if I lose my Master Password?",
        content: (
          <>
            Due to our{" "}
            <span className="font-bold text-emerald-500">
              zero-knowledge architecture
            </span>
            , there is{" "}
            <span className="font-bold text-red-500">
              no 'Forgot Password' option
            </span>
            . If the Master Password is lost, the{" "}
            <span className="font-bold text-red-500">
              encrypted data cannot be recovered
            </span>
            . We recommend keeping a{" "}
            <span className="font-bold text-amber-500">physical backup</span> of
            your Master Password in a secure location.
          </>
        ),
      },

      {
        id: "trust",

        icon: <Code className="w-6 h-6 text-purple-500" />,

        title: "Why is PKey Open Source?",
        content: (
          <>
            {" "}
            <span className="font-bold text-emerald-500">
              Transparency is the foundation of security
            </span>
            . By making PKey{" "}
            <span className="font-bold text-emerald-500">open-source</span>, we
            allow the community to{" "}
            <span className="font-bold text-emerald-500">
              audit our encryption logic
            </span>
            , ensuring there are{" "}
            <span className="font-bold text-emerald-500">
              no backdoors or hidden vulnerabilities
            </span>
            . You can{" "}
            <span className="font-bold text-emerald-500">
              verify our claims on GitHub
            </span>
            .
          </>
        ),
      },

      {
        id: "access",

        icon: <EyeOff className="w-6 h-6 text-indigo-500" />,

        title: "Can PKey access my data?",
        content: (
          <>
            {" "}
            <span className="font-bold text-red-500">No</span>. PKey follows a{" "}
            <span className="font-bold text-emerald-500">
              strict zero-knowledge architecture
            </span>
            , meaning your data is{" "}
            <span className="font-bold text-emerald-500">
              encrypted before it reaches our servers
            </span>
            . Even our team{" "}
            <span className="font-bold text-red-500">
              cannot view, access, or decrypt
            </span>{" "}
            your stored information.
          </>
        ),
      },

      {
        id: "breach",

        icon: <ShieldAlert className="w-6 h-6 text-rose-500" />,

        title: "What happens if PKey servers are compromised?",
        content: (
          <>
            Even in the{" "}
            <span className="font-bold text-amber-500">
              unlikely event of a server breach
            </span>
            , your data{" "}
            <span className="font-bold text-emerald-500">
              remains protected
            </span>
            . All sensitive information is{" "}
            <span className="font-bold text-emerald-500">
              encrypted client-side
            </span>
            , and without your Master Password, the encrypted data is{" "}
            <span className="font-bold text-red-500">
              useless and cannot be decrypted
            </span>
            .
          </>
        ),
      },

      {
        id: "strength",
        icon: <Lock className="w-6 h-6 text-blue-500" />,
        title: "How strong is the encryption?",
        content: (
          <>
            PKey uses{" "}
            <span className="font-bold text-emerald-500">
              AES-256-GCM authenticated encryption
            </span>
            . Your Master Password is run through{" "}
            <span className="font-bold text-emerald-500">
              Argon2id (a memory-hard algorithm)
            </span>{" "}
            to derive a secure key, making advanced GPU brute-force attacks{" "}
            <span className="font-bold text-emerald-500">
              nearly impossible
            </span>
            .
          </>
        ),
      },

      {
        id: "sync",

        icon: <Smartphone className="w-6 h-6 text-green-500" />,

        title: "Is syncing across devices secure?",
        content: (
          <>
            {" "}
            <span className="font-bold text-emerald-500">Yes</span>. Your data
            is{" "}
            <span className="font-bold text-emerald-500">
              always encrypted before syncing
            </span>
            . This ensures that even while transferring between devices, your
            information remains{" "}
            <span className="font-bold text-emerald-500">
              protected and unreadable
            </span>{" "}
            to anyone without your Master Password.
          </>
        ),
      },

      {
        id: "environment",
        icon: <Cpu className="w-6 h-6 text-green-500" />,
        title: "Is browser-based encryption safe and fast?",
        content: (
          <>
            {" "}
            <span className="font-bold text-emerald-500">Yes</span>. PKey
            leverages{" "}
            <span className="font-bold text-emerald-500">
              WebAssembly (WASM)
            </span>{" "}
            and the{" "}
            <span className="font-bold text-emerald-500">
              Native Web Crypto API
            </span>{" "}
            via Background Workers. This ensures military-grade cryptography
            happens locally{" "}
            <span className="font-bold text-emerald-500">
              without ever freezing or slowing down your device
            </span>
            .
          </>
        ),
      },

      {
        id: "privacy",

        icon: <UserX className="w-6 h-6 text-yellow-500" />,

        title: "Do you track or collect my data?",
        content: (
          <>
            {" "}
            <span className="font-bold text-red-500">No</span>. PKey{" "}
            <span className="font-bold text-red-500">
              does not track, analyze, or sell your personal data
            </span>
            . We only collect the{" "}
            <span className="font-bold text-emerald-500">
              minimum required information
            </span>{" "}
            to provide the service.
          </>
        ),
      },
    ],
    [],
  );

  const [activeSection, setActiveSection] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  useEffect(() => {
    const observerOptions = {
      root: null,
      // This margin creates a "trigger line" near the top of the screen
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        // When a section crosses our trigger line, update the state!
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);
  useEffect(() => {
    if (!activeSection) return;
    const activeSidebarItems = document.querySelectorAll(`[data-sidebar-id="${activeSection}"]`);
    
    activeSidebarItems.forEach((item) => {
      item.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  }, [activeSection]);

  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      // setIsSidebarOpen(false);
    }
  }, []);



  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6 px-2 md:px-4">
      <div className="mb-6 px-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Navigation
        </h3>
      </div>
      {/* <div className="flex-1 overflow-y-auto scroll-bar-hide space-y-1"> */}
      <div className="flex-1 overflow-y-auto scroll-bar-hide space-y-1 overscroll-contain">
        {sections.map((section) => {
          // Check if this specific button is the active one
          const isActive = activeSection === section.id;

          return (
            <button
              data-sidebar-id={section.id}
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-3 group
        hover:bg-blue-50 hover:dark:bg-blue-900/30 hover:text-blue-600 hover:dark:text-blue-400 hover:border-l-4 hover:border-blue-600
        focus:bg-blue-50 focus:dark:bg-blue-900/30 focus:text-blue-600 focus:dark:text-blue-400 focus:border-l-4 focus:border-blue-600
        ${
          isActive
            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600"
            : "border-l-4 border-transparent text-gray-700 dark:text-gray-300"
        }`}
            >
              <span
                className={`shrink-0 transition-transform duration-300 group-hover:scale-110 
          ${isActive ? "scale-110 opacity-100" : "opacity-70"}`}
              >
                {React.cloneElement(section.icon)}
              </span>
              <span className="truncate">{section.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
  const MemoSideBarContent = React.memo(SidebarContent);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Mobile Hamburger Menu */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        // className="lg:hidden  fixed left-3 top-20"
        className="cursor-pointer fixed bottom-6 right-6 z-50 lg:hidden text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 active:scale-95 transition-all p-3 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 duration-300"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden transition-all duration-300 ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />
      {/* Drawer */}
      <div
        className={`rounded-r-2xl fixed top-0 left-0 h-full w-70 bg-white dark:bg-gray-900 z-50 lg:hidden shadow-2xl border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute cursor-pointer top-4 right-4 p-1 text-red-500 dark:text-red-400 border-2 rounded-full hover:scale-105 transition-all duration-300"
        >
          <X className="w-6 h-6" />
        </button>
        <MemoSideBarContent />
      </div>

      <div className="max-w-360 mx-auto flex">
        {/* Desktop Sidebar */}
        <aside className="hidden rounded-2xl lg:block w-84 h-[calc(100vh-6rem)] sticky top-20 border-r border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm overflow-hidden">
          <MemoSideBarContent />
        </aside>

        <main className="flex-1 px-6 pt-32 pb-24 max-w-4xl mx-auto lg:mx-0 lg:px-12">
          {/* Header Section */}

          <ScrollReveal direction="up" className="text-center mb-20">
            <BackToHomeBtn />

            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white my-6">
              Security <span className="text-blue-600">Architecture</span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Understanding how PKey protects your digital identity through
              advanced encryption and zero-knowledge protocols.
            </p>
          </ScrollReveal>

          <div className="grid gap-6">
            {sections.map((section, index) => (
              <section id={section.id} key={section.id}>
                <ScrollReveal
                  direction="up"
                  className="group p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-700 group-hover:scale-110 transition-transform duration-300">
                      {section.icon}
                    </div>

                    <div className="space-y-3">
                      <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                        {section.title}
                      </h2>

                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </section>
            ))}
          </div>

          {/* Footer CTA */}

          <ScrollReveal
            direction="up"
            className="mt-20 p-6 md:p-10 rounded-4xl bg-linear-to-br from-blue-600 to-indigo-700 text-center text-white"
          >
            <ShieldCheck className="w-12 h-12 mx-auto mb-6 opacity-80" />

            <h3 className="text-2xl font-black mb-4">Still have questions?</h3>

            <p className="text-blue-100 mb-8 font-medium">
              Explore our source code or reach out to the developer on GitHub.
            </p>

            <a
              href="https://github.com/Prince-772/PKey"
              target="_blank"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-black rounded-full hover:bg-blue-50 transition-all active:scale-95 duration-300"
            >
              Review GitHub <ChevronRight className="w-5 h-5 shrink-0" />
            </a>
          </ScrollReveal>
        </main>
      </div>

      <Footer />
    </div>
  );
}
