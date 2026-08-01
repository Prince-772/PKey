import toast from "react-hot-toast";
import zxcvbn from "zxcvbn";
import { categorizePasscode } from "@/lib/passcodes/passcodeStrength";

export function capitalize(str) {
  if (!str) return "";
  return str[0].toUpperCase() + str.slice(1);
}

export const getPasswordStrength = (password) => {
  if (!password) return { category: "", score: 0, result: null };

  const result = zxcvbn(password);
  const score = Math.round(result.score * 25); // 0-100%

  const categories = ["Very Weak", "Weak", "Fair", "Good", "Very Strong"];
  return {
    category: categories[result.score],
    score,
    result,
    realScore: result.score,
  };
};

export const handleCopy = async (text, setCopied) => {
  try {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      const input = document.createElement("textarea");
      input.value = text;
      input.setAttribute("readonly", "");
      input.style.position = "absolute";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    } else {
      await navigator.clipboard.writeText(text);
    }
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    toast.error("Failed to copy");
  }
};

// Analysis helper
export function analyzePasswords(passwords) {
  const weak = passwords.filter((p) => p.strength === "weak");
  const medium = passwords.filter((p) => p.strength === "moderate");
  const strong = passwords.filter((p) => p.strength === "strong");

  // Reuse detection. object level pe karo, username compare mat karo
  const passMap = {};
  passwords.forEach((p) => {
    if (!passMap[p.password]) passMap[p.password] = [];
    passMap[p.password].push(p);
  });

  const reusedGroups = Object.values(passMap).filter((group) => {
    if (group.length <= 1) return false;
    // Different _id = different vault entry = reused
    const uniqueIds = new Set(group.map((p) => p._id.toString()));
    return uniqueIds.size > 1;
  });
  const reusedIds = new Set(reusedGroups.flat().map((p) => p._id));

  // Health score
  const weakPenalty = weak.length * 8;
  const reusedPenalty = reusedIds.size * 5;
  const base = passwords.length > 0 ? 100 : 0;
  const healthScore = Math.max(
    0,
    Math.min(100, base - weakPenalty - reusedPenalty),
  );

  return { weak, medium, strong, reusedGroups, reusedIds, healthScore };
}

// Passcode analysis helper 
export function analyzePasscodes(passcodes) {
  const weak = passcodes.filter((p) => p.strength === "weak");
  const medium = passcodes.filter((p) => p.strength === "moderate");
  const strong = passcodes.filter((p) => p.strength === "strong");

  // Reuse detection for PINs
  const pinMap = {};
  passcodes.forEach((p) => {
    if (!pinMap[p.pin]) pinMap[p.pin] = [];
    pinMap[p.pin].push(p);
  });

  const reusedGroups = Object.values(pinMap).filter((group) => {
    if (group.length <= 1) return false;
    const uniqueIds = new Set(group.map((p) => p._id.toString()));
    return uniqueIds.size > 1;
  });
  const reusedIds = new Set(reusedGroups.flat().map((p) => p._id));

  // Health score (PINs are inherently weaker, adjust penalties)
  const weakPenalty = weak.length * 10;
  const reusedPenalty = reusedIds.size * 8;
  const base = passcodes.length > 0 ? 100 : 0;
  const healthScore = Math.max(
    0,
    Math.min(100, base - weakPenalty - reusedPenalty),
  );

  return { weak, medium, strong, reusedGroups, reusedIds, healthScore };
}

// Combined vault analysis
export function analyzeVault(passwords, passcodes) {
  const passAnalysis = analyzePasswords(passwords);
  const pinAnalysis = analyzePasscodes(passcodes);

  // Combined health score - weighted average
  const totalItems = passwords.length + passcodes.length;
  const pinWeight = totalItems > 0 ? passcodes.length / totalItems : 0;

  const healthScore = (() => {
    if (totalItems === 0) return 0;

    if (passwords.length === 0) return pinAnalysis.healthScore;

    let score = passAnalysis.healthScore;

    if (passcodes.length > 0) {
      
      const IDEAL_PIN_SCORE = 70;

      const pinGap = pinAnalysis.healthScore - IDEAL_PIN_SCORE;

      if (pinGap < 0) {
        const pinImpact = pinWeight * 0.5;
        score = Math.round(score + pinGap * pinImpact);
      }
    }

    return Math.min(100, Math.max(0, score));
  })();

  // Combine weak entries (with type tag)
  const weak = [
    ...passAnalysis.weak.map((p) => ({ ...p, type: "password" })),
    ...pinAnalysis.weak.map((p) => ({ ...p, type: "passcode" })),
  ];

  // Combine reused groups
  const reusedGroups = [
    ...passAnalysis.reusedGroups.map((g) =>
      g.map((p) => ({ ...p, type: "password" })),
    ),
    ...pinAnalysis.reusedGroups.map((g) =>
      g.map((p) => ({ ...p, type: "passcode" })),
    ),
  ];

  const reusedIds = new Set([
    ...passAnalysis.reusedIds,
    ...pinAnalysis.reusedIds,
  ]);

  return {
    healthScore,
    weak,
    reusedGroups,
    reusedIds,
    // Breakdown by type
    passwords: passAnalysis,
    passcodes: pinAnalysis,
  };
}
