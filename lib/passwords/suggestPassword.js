const SuggestPassword = ({
  length = 20,
  isUppercase = true,
  isLowercase = true,
  isNumbers = true,
  isSymbols = true,
} = {}) => {
  const safeLength = Math.min(Math.max(Number(length) || 20, 8), 64);
  const characters = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*_+.?-",
  };

  const charTypes = [
    isUppercase && characters.uppercase,
    isLowercase && characters.lowercase,
    isNumbers && characters.numbers,
    isSymbols && characters.symbols,
  ].filter(Boolean);

  if (!charTypes.length) return "";

  const allChars = charTypes.join("");

  let password = [];

  // Ensure at least one from each type
  charTypes.forEach((set) => {
    password.push(set[getRandomCryptoInt(set.length)]);
  });

  // Fill rest of password
  while (password.length < safeLength) {
    password.push(allChars[getRandomCryptoInt(allChars.length)]);
  }

  // Shuffle final password
  shuffleArray(password);

  return password.join("");
};

const getRandomCryptoInt = (max) => {
  const bytes = new Uint32Array(1);
  globalThis.crypto.getRandomValues(bytes); // safer for SSR
  return bytes[0] % max;
};

const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getRandomCryptoInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

export default SuggestPassword;
