/**
 * Generate a cryptographically random passcode / PIN that scores well.
 *
 * @param {Object} options
 * @param {number}  [options.length=8]    — length of the passcode (4–32, clamped)
 * @param {string}  [options.charset="numeric"] — "numeric" | "alphanumeric" | "complex"
 * @returns {string}
 */
export default function suggestPasscode({
  length = 8,
  charset = "numeric",
} = {}) {
  const safeLength = Math.min(Math.max(Number(length) || 8, 4), 32);

  const pools = {
    numbers: "0123456789",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    symbols: "!@#$%^&*_+-=?",
  };

  let chars;
  switch (charset) {
    case "alphanumeric":
      chars = pools.numbers + pools.lowercase + pools.uppercase;
      break;
    case "complex":
      chars = pools.numbers + pools.lowercase + pools.uppercase + pools.symbols;
      break;
    default:
      chars = pools.numbers;
      break;
  }

  // Common weak PIN patterns to avoid
  const COMMON_PINS = new Set([
    "0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999",
    "0123", "1234", "2345", "3456", "4567", "5678", "6789", "7890",
    "0987", "9876", "8765", "7654", "6543", "5432", "4321", "3210",
    "1122", "1133", "1144", "1155", "2211", "2233", "3311", "3322",
    "1212", "1313", "1414", "1515", "1616", "1717", "1818", "1919",
    "0101", "0202", "0303", "0404", "0505", "0606", "0707", "0808", "0909",
    "1001", "2002", "3003", "4004", "5005", "6006", "7007", "8008", "9009",
    "111111", "222222", "333333", "444444", "555555", "666666", "777777", "888888", "999999",
    "123456", "12345678", "654321", "789012", "012345",
    "2580", "0852", "1590", "3579", "7531", "9516",
  ]);

  function isWeakPattern(pin) {
    const s = String(pin);

    // Check common PINs (check all substrings of length 4+)
    if (s.length >= 4) {
      for (let i = 0; i <= s.length - 4; i++) {
        if (COMMON_PINS.has(s.slice(i, i + 4))) return true;
      }
    }

    // Check all same digits
    if (new Set(s).size === 1) return true;

    // Check sequential (ascending/descending)
    const digits = [...s].filter(c => c >= "0" && c <= "9");
    if (digits.length >= 3) {
      const nums = digits.map(Number);
      const isSeq = nums.slice(1).every((n, i) => n === (nums[i] + 1) % 10);
      const isDesc = nums.slice(1).every((n, i) => n === (nums[i] - 1 + 10) % 10);
      if (isSeq || isDesc) return true;

      // Check step patterns (e.g., 1357, 2468)
      const isStepUp = nums.slice(1).every((n, i) => n === (nums[i] + 2) % 10);
      const isStepDn = nums.slice(1).every((n, i) => n === (nums[i] - 2 + 10) % 10);
      if (isStepUp || isStepDn) return true;
    }

    // Check repeated chunks (e.g., 1212, 123123)
    if (s.length >= 4 && s.length % 2 === 0) {
      const half = s.length / 2;
      if (s.slice(0, half) === s.slice(half)) return true;
    }
    if (s.length >= 6 && s.length % 3 === 0) {
      const third = s.length / 3;
      if (s.slice(0, third) === s.slice(third, 2 * third) && s.slice(0, third) === s.slice(2 * third)) return true;
    }

    // Check date patterns (MMDD, YYMMDD, YYYY)
    const numOnly = s.replace(/[^0-9]/g, "");
    if (numOnly.length === 4) {
      const m = parseInt(numOnly.slice(0, 2)), d = parseInt(numOnly.slice(2, 4));
      if (m >= 1 && m <= 12 && d >= 1 && d <= 31) return true;
      const y = parseInt(numOnly);
      if (y >= 1950 && y <= 2030) return true;
    }
    if (numOnly.length === 6) {
      const y = parseInt(numOnly.slice(0, 4));
      if (y >= 1950 && y <= 2030) return true;
    }

    // Check keyboard patterns (numeric keypad)
    const rows = ["789", "456", "123", "0"];
    for (let i = 0; i < numOnly.length - 1; i++) {
      const a = numOnly[i], b = numOnly[i + 1];
      for (const row of rows) {
        const ia = row.indexOf(a), ib = row.indexOf(b);
        if (ia !== -1 && ib !== -1 && Math.abs(ia - ib) === 1) return true;
      }
      // Column check
      const cols = ["147", "258", "369", "0"];
      for (const col of cols) {
        const ia = col.indexOf(a), ib = col.indexOf(b);
        if (ia !== -1 && ib !== -1 && Math.abs(ia - ib) === 1) return true;
      }
    }

    // Check palindrome
    if (s.length >= 4 && s === s.split("").reverse().join("")) return true;

    return false;
  }

  // Generate with retries to avoid weak patterns (max 10 attempts)
  let passcode = "";
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const bytes = new Uint32Array(safeLength);
    crypto.getRandomValues(bytes);

    passcode = "";
    for (let i = 0; i < safeLength; i++) {
      passcode += chars[bytes[i] % chars.length];
    }

    if (!isWeakPattern(passcode)) {
      return passcode;
    }
    attempts++;
  }

  // If all attempts failed (extremely unlikely), return last one
  return passcode;
}