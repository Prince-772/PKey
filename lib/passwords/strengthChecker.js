import { getPasswordStrength } from "../helper.js";

const categorizePassword = (password) => {
  const result = getPasswordStrength(password).realScore;
  if (result <= 1) return "weak";
  else if (result === 2) return "moderate";
  return "strong";
};
export default categorizePassword;
