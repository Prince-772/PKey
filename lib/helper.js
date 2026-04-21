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
    realScore: result.score
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
      toast.success("Copied!")
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy")
    }
  };