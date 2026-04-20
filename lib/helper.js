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