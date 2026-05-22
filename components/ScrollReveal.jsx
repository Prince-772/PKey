"use client";

import { useEffect, useRef, useState } from "react";

const directions = {
  up: { initial: "translate-y-4", final: "translate-y-0" },
  down: { initial: "-translate-y-4", final: "translate-y-0" },
  left: { initial: "translate-x-4", final: "translate-x-0" },
  right: { initial: "-translate-x-4", final: "translate-x-0" },
};

export default function ScrollReveal({
  children,
  className = "",
  delayMs = 0,
  once = true,
  rootMargin = "0px 0px -10% 0px",
  direction = "up",
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const motion = directions[direction] || directions.up;

  useEffect(() => {
    const el = ref.current;
    if (!el || (once && isVisible)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
    
  }, [once, rootMargin]);

  return (
    <div
      ref={ref}
      className={
        `transition-all duration-700 will-change-transform motion-reduce:transition-none ${className} ` +
        (isVisible
          ? `opacity-100 ${motion.final}`
          : `opacity-0 ${motion.initial}`)
      }
      style={{ transitionDelay: `${delayMs}ms` }}
      // aria-hidden={!isVisible}
    >
      {children}
    </div>
  );
}
