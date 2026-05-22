/**
 * migrate-to-scroll-reveal.mjs
 *
 * Framer Motion → ScrollReveal Codemod
 *
 * Kya karta hai:
 *  1. Sabhi .js/.jsx/.ts/.tsx files scan karta hai (node_modules exclude)
 *  2. motion.div (whileInView) → <ScrollReveal ...> convert karta hai
 *  3. delay values → delayMs mein convert karta hai
 *  4. framer-motion imports clean karta hai
 *  5. ScrollReveal import add karta hai
 *  6. AnimatePresence wali files flag karta hai (manual work needed)
 *  7. Ek detailed report print karta hai
 *
 * Usage:
 *   node migrate-to-scroll-reveal.mjs [project-root]
 *
 * Example:
 *   node migrate-to-scroll-reveal.mjs .
 *   node migrate-to-scroll-reveal.mjs ./src
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// ─── CONFIG ──────────────────────────────────────────────────────────────────

// ScrollReveal component ka relative path (apne project structure ke hisaab se badlo)
const SCROLL_REVEAL_IMPORT_PATH = "@/components/ScrollReveal";

// Directories jo skip karni hain
const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "out",
  "build",
  ".turbo",
  "coverage",
]);

// Supported extensions
const EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

const c = (color, text) => `${colors[color]}${text}${colors.reset}`;

function log(msg) {
  console.log(msg);
}

function getAllFiles(dir, files = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (entry.isFile() && EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

// ─── DIRECTION DETECTOR ──────────────────────────────────────────────────────

/**
 * motion.div ke initial prop se direction detect karta hai
 * { opacity: 0, y: 20 }  → "up"
 * { opacity: 0, y: -20 } → "down"
 * { opacity: 0, x: 20 }  → "left"
 * { opacity: 0, x: -20 } → "right"
 * baaki cases              → "up" (default)
 */
function detectDirection(initialStr) {
  if (!initialStr) return "up";

  const yMatch = initialStr.match(/y\s*:\s*(-?\d+)/);
  const xMatch = initialStr.match(/x\s*:\s*(-?\d+)/);

  if (yMatch) {
    const val = parseInt(yMatch[1], 10);
    return val > 0 ? "up" : "down";
  }
  if (xMatch) {
    const val = parseInt(xMatch[1], 10);
    return val > 0 ? "left" : "right";
  }
  return "up";
}

/**
 * delay value milliseconds mein extract karta hai
 * transition={{ delay: 0.3 }} → 300
 */
function extractDelayMs(transitionStr) {
  if (!transitionStr) return null;
  const match = transitionStr.match(/delay\s*:\s*([\d.]+)/);
  if (!match) return null;
  return Math.round(parseFloat(match[1]) * 1000);
}

// ─── CORE TRANSFORM ──────────────────────────────────────────────────────────

/**
 * Main transform function — ek file ka content process karta hai
 * Returns: { newContent, changed, conversions, hasAnimatePresence }
 */
function transformContent(content, filePath) {
  let newContent = content;
  let conversions = 0;
  const hasAnimatePresence = /AnimatePresence/g.test(content);

  // ── Step 1: motion.div whileInView → ScrollReveal ──────────────────────

  // Regex: <motion.div ... whileInView ... > (single tag, multiline)
  // Yeh approach line-by-line nahi, token-based hai — nested tags handle nahi karta
  // isliye hum ek pragmatic regex use karte hain jo common patterns cover kare

  // Pattern: <motion.div\n  prop1\n  prop2\n> style mein written JSX
  newContent = newContent.replace(
    /<motion\.div([\s\S]*?)>/g,
    (fullMatch, propsStr) => {
      // Sirf whileInView wale motion.div convert karo
      if (!propsStr.includes("whileInView")) {
        return fullMatch; // touch mat karo
      }

      // Props extract karo
      const initialMatch = propsStr.match(/initial=\{(\{[^}]*\})\}/);
      const transitionMatch = propsStr.match(/transition=\{(\{[^}]*\})\}/);
      const classMatch = propsStr.match(/className=\{?["'`]([^"'`}]*)["'`]\}?/);
      const classTemplatMatch = propsStr.match(/className=\{(`[^`]*`)\}/);

      const initialStr = initialMatch ? initialMatch[1] : null;
      const transitionStr = transitionMatch ? transitionMatch[1] : null;

      const direction = detectDirection(initialStr);
      const delayMs = extractDelayMs(transitionStr);

      // className reconstruct
      let classNameProp = "";
      if (classTemplatMatch) {
        classNameProp = `className={${classTemplatMatch[1]}}`;
      } else if (classMatch) {
        classNameProp = `className="${classMatch[1]}"`;
      }

      // key prop preserve karo (agar ho to)
      const keyMatch = propsStr.match(/key=\{([^}]+)\}/);
      const keyProp = keyMatch ? ` key={${keyMatch[1]}}` : "";

      // ScrollReveal tag banao
      let tag = `<ScrollReveal${keyProp} direction="${direction}"`;
      if (delayMs && delayMs > 0) tag += ` delayMs={${delayMs}}`;
      if (classNameProp) tag += ` ${classNameProp}`;
      tag += `>`;

      conversions++;
      return tag;
    }
  );

  // ── Step 2: </motion.div> → </ScrollReveal> ───────────────────────────
  // Sirf wahan replace karo jahan conversion hua ho
  if (conversions > 0) {
    newContent = newContent.replace(/<\/motion\.div>/g, "</ScrollReveal>");
  }

  // ── Step 3: Framer Motion imports clean karo ──────────────────────────
  if (conversions > 0) {
    // motion import remove karo (agar AnimatePresence nahi hai to puri line)
    newContent = newContent.replace(
      /import\s*\{([^}]*)\}\s*from\s*['"]framer-motion['"]\s*;?\n?/g,
      (fullImport, importList) => {
        const items = importList
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        // AnimatePresence rakhna hai (manual kaam baaki hai)
        const keepItems = items.filter(
          (item) =>
            item === "AnimatePresence" ||
            // motion.div ke alawa doosre motion.* use hote hain to unhe flag karo
            (item !== "motion" && item !== "AnimatePresence")
        );

        // Agar sirf "motion" tha aur AnimatePresence nahi — import hata do
        if (keepItems.length === 0) {
          return ""; // puri import line remove
        }

        // AnimatePresence ya kuch aur bacha hai — partial import rakhna
        return `import { ${keepItems.join(", ")} } from 'framer-motion';\n`;
      }
    );
  }

  // ── Step 4: ScrollReveal import add karo ─────────────────────────────
  if (conversions > 0 && !content.includes("ScrollReveal")) {
    // "use client" ke baad ya pehli import ke baad inject karo
    const useClientMatch = newContent.match(/^["']use client["']\s*;?\n/m);
    const insertAfter = useClientMatch ? useClientMatch[0] : "";

    if (insertAfter) {
      newContent = newContent.replace(
        insertAfter,
        `${insertAfter}import ScrollReveal from '${SCROLL_REVEAL_IMPORT_PATH}';\n`
      );
    } else {
      // Pehli import ke pehle add karo
      newContent = `import ScrollReveal from '${SCROLL_REVEAL_IMPORT_PATH}';\n` + newContent;
    }
  }

  const changed = newContent !== content;
  return { newContent, changed, conversions, hasAnimatePresence };
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

function main() {
  const projectRoot = path.resolve(process.argv[2] || ".");

  if (!fs.existsSync(projectRoot)) {
    log(c("red", `❌ Directory nahi mili: ${projectRoot}`));
    process.exit(1);
  }

  log("");
  log(c("bold", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  log(c("bold", "  🔄  Framer Motion → ScrollReveal Migration Script"));
  log(c("bold", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  log(c("gray", `  Project: ${projectRoot}`));
  log(c("gray", `  ScrollReveal import: ${SCROLL_REVEAL_IMPORT_PATH}`));
  log("");

  // Files collect karo
  const allFiles = getAllFiles(projectRoot);
  log(c("cyan", `  📁 ${allFiles.length} files scan ho rahi hain...\n`));

  // Results track karne ke liye
  const report = {
    converted: [],       // { file, conversions }
    skipped: [],         // files jahan kuch nahi tha
    animatePresence: [], // files jahan AnimatePresence hai (manual needed)
    errors: [],          // files jahan error aaya
  };

  // Har file process karo
  for (const filePath of allFiles) {
    let content;
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch (err) {
      report.errors.push({ file: filePath, error: err.message });
      continue;
    }

    // Quick check — framer-motion import hai kya?
    if (!content.includes("framer-motion") && !content.includes("motion.div")) {
      continue;
    }

    const relPath = path.relative(projectRoot, filePath);

    try {
      const { newContent, changed, conversions, hasAnimatePresence } =
        transformContent(content, filePath);

      if (hasAnimatePresence) {
        report.animatePresence.push({ file: relPath, conversions });
      }

      if (changed) {
        fs.writeFileSync(filePath, newContent, "utf-8");
        report.converted.push({ file: relPath, conversions });
      } else if (content.includes("framer-motion")) {
        // framer-motion hai par convert nahi hua (AnimatePresence only, ya motion.* nahi whileInView wala)
        report.skipped.push({ file: relPath, reason: "No whileInView pattern found" });
      }
    } catch (err) {
      report.errors.push({ file: relPath, error: err.message });
    }
  }

  // ─── REPORT PRINT ────────────────────────────────────────────────────────

  log("\n" + c("bold", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  log(c("bold", "  📊  MIGRATION REPORT"));
  log(c("bold", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

  // ✅ Successfully converted
  log("\n" + c("green", `  ✅ CONVERTED (${report.converted.length} files)`));
  if (report.converted.length === 0) {
    log(c("gray", "     Koi file convert nahi hui."));
  } else {
    for (const { file, conversions } of report.converted) {
      log(
        c("green", `     ✓ ${file}`) +
        c("gray", `  (${conversions} motion.div → ScrollReveal)`)
      );
    }
  }

  // ⚠️ AnimatePresence — manual work needed
  log("\n" + c("yellow", `  ⚠️  ANIMATE PRESENCE DETECTED (manual work needed) — ${report.animatePresence.length} files`));
  if (report.animatePresence.length === 0) {
    log(c("gray", "     Koi AnimatePresence nahi mila. 🎉"));
  } else {
    log(c("yellow", "     In files mein AnimatePresence hai — manually refactor karo:\n"));
    for (const { file, conversions } of report.animatePresence) {
      const note = conversions > 0 ? " (motion.div convert ho gaya, AnimatePresence bacha)" : " (sirf AnimatePresence — conversion nahi hua)";
      log(c("yellow", `     ⚠  ${file}`) + c("gray", note));
    }

    log("\n" + c("yellow", "  AnimatePresence alternatives:"));
    log(c("gray", "     • Modal/Drawer  → CSS opacity-0 + pointer-events-none trick"));
    log(c("gray", "     • Tabs          → conditional className toggle"));
    log(c("gray", "     • Toast/Alerts  → 'sonner' library (zero dependency)"));
    log(c("gray", "     • Page transitions → Next.js View Transitions API"));
  }

  // ⏭️ Skipped
  log("\n" + c("blue", `  ⏭️  SKIPPED (${report.skipped.length} files — framer-motion hai par pattern match nahi hua)`));
  if (report.skipped.length > 0) {
    for (const { file, reason } of report.skipped) {
      log(c("blue", `     → ${file}`) + c("gray", `  (${reason})`));
    }
    log(c("gray", "\n     In files ko manually check karo — motion.animate, useAnimation etc. ho sakta hai."));
  }

  // ❌ Errors
  if (report.errors.length > 0) {
    log("\n" + c("red", `  ❌ ERRORS (${report.errors.length} files)`));
    for (const { file, error } of report.errors) {
      log(c("red", `     ✗ ${file}: ${error}`));
    }
  }

  // ─── SUMMARY ─────────────────────────────────────────────────────────────

  const totalConversions = report.converted.reduce((sum, f) => sum + f.conversions, 0);

  log("\n" + c("bold", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  log(c("bold", "  📈  SUMMARY"));
  log(c("bold", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  log(c("green",  `     Files converted       : ${report.converted.length}`));
  log(c("green",  `     motion.div → ScrollReveal: ${totalConversions}`));
  log(c("yellow", `     AnimatePresence files  : ${report.animatePresence.length} (manual needed)`));
  log(c("blue",   `     Skipped (no pattern)   : ${report.skipped.length}`));
  log(c("red",    `     Errors                 : ${report.errors.length}`));

  log("\n" + c("bold", "  📋  NEXT STEPS"));
  log(c("gray",  "     1. ScrollReveal.jsx component apne project mein copy karo"));
  log(c("gray",  `     2. Path check karo: ${SCROLL_REVEAL_IMPORT_PATH}`));
  log(c("gray",  "     3. AnimatePresence wali files manually refactor karo (list upar hai)"));
  log(c("gray",  "     4. Skipped files manually check karo"));
  log(c("gray",  "     5. `npm run build` ya `next dev` chala ke verify karo"));

  if (report.converted.length > 0) {
    log("\n" + c("cyan", "  💡  Framer Motion uninstall karne se pehle AnimatePresence files fix karo!"));
    log(c("gray",  "     Jab sab theek ho jaye: npm uninstall framer-motion"));
  }

  log("\n" + c("bold", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));
}

main();
