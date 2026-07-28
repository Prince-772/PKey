import toast from "react-hot-toast";
import zxcvbn from "zxcvbn";

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

// ── Analysis helper ───────────────────────────────────────────────────────────
export function analyzePasswords(passwords) {
  const weak = passwords.filter((p) => p.strength === "weak");
  const medium = passwords.filter((p) => p.strength === "moderate");
  const strong = passwords.filter((p) => p.strength === "strong");

  // Reuse detection — object level pe karo, username compare mat karo
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
