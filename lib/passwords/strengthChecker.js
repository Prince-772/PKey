const categorizePassword = (password) => {
  const conditions = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    symbol: /[!@#$%^&*_+.?\-]/,
  };

  let strengthScore = 0;

  // Check each category
  Object.values(conditions).forEach((regex) => {
    if (regex.test(password)) strengthScore++;
  });

  const length = password.length;

  if (length >= 12 && strengthScore === 4) return "strong";
  if (length >= 8 && strengthScore >= 3) return "moderate";
  return "weak";
};

export default categorizePassword