const COMMON_PINS = new Set([
  "0000","1111","2222","3333","4444","5555","6666","7777","8888","9999",
  "0123","1234","2345","3456","4567","5678","6789","7890",
  "0987","9876","8765","7654","6543","5432","4321","3210",
  "1122","1133","1144","1155","2211","2233","3311","3322",
  "1212","1313","1414","1515","1616","1717","1818","1919",
  "0101","0202","0303","0404","0505","0606","0707","0808","0909",
  "1001","2002","3003","4004","5005","6006","7007","8008","9009",
  "112233","123123","121212","123321","321123","654321",
  "1112","1222","1113","1223","2221","2111","3331","3111",
  "1004","2001","2010","1200","1100","1123","1235",
  "0001","0010","0100","1000","000","00000","000000","00007","00013",
  "2580","0852","1590","3579","7531","9516",
  "1990","1991","1992","1993","1994","1995","1996","1997","1998","1999",
  "2000","2001","2002","2003","2004","2005","2006","2007","2008","2009",
  "2010","2011","2012","2013","2014","2015","2016","2017","2018","2019",
  "2020","2021","2022","2023","2024","2025",
  "12345","123456","1234567","12345678",
  "111111","222222","333333","444444","555555","666666","777777","888888","999999",
  "11111111","22222222","33333333","44444444",
  "87654321","567890","987654","9876543","98765432",
  "qwerty","asdfgh","zxcvbn","qwertyuiop","asdfghjkl",
  "pass","passcode","password","admin","root","user","guest",
  "letmein","welcome","master","access","login","trustno1",
  "abc123","abcd","abcd1234","123abc",
  "6969","6669","6699","911","119","999","911911",
  "314159","271828","161803","141421",
  "7755","3282","8237","9173",
  "1969","1970","1980","1985","1986","1987","1988","1989",
  "2026","2027","2028","2029","2030",
]);

function calculateEntropy(pin) {
  let pool = 0;
  if (/[0-9]/.test(pin)) pool += 10;
  if (/[a-z]/.test(pin)) pool += 26;
  if (/[A-Z]/.test(pin)) pool += 26;
  if (/[^a-zA-Z0-9]/.test(pin)) pool += 32;
  if (pool === 0) return 0;
  return pin.length * Math.log2(pool);
}

function detectSequence(pin) {
  const digits = [...pin].filter(c => c >= "0" && c <= "9");
  if (digits.length < 3) return 0;
  const nums = digits.map(Number);
  const isSeq = nums.slice(1).every((n, i) => n === (nums[i] + 1) % 10);
  const isDesc = nums.slice(1).every((n, i) => n === (nums[i] - 1 + 10) % 10);
  const isStepUp = nums.slice(1).every((n, i) => n === (nums[i] + 2) % 10);
  const isStepDn = nums.slice(1).every((n, i) => n === (nums[i] - 2 + 10) % 10);
  if (isSeq || isDesc) return 2;
  if (isStepUp || isStepDn) return 1;
  return 0;
}

function detectRepeats(pin) {
  if (new Set(pin).size === 1) return -3;
  let repeats = 0;
  for (let i = 0; i < pin.length - 1; i++) {
    if (pin[i] === pin[i + 1]) repeats++;
  }
  if (repeats >= Math.floor(pin.length / 2)) return -2;
  if (repeats >= 1) return -1;
  return 0;
}

function isPalindrome(s) {
  return s.length >= 4 && s === s.split("").reverse().join("");
}

function detectRepeatedChunk(pin) {
  if (pin.length >= 4 && pin.length % 2 === 0) {
    const half = pin.length / 2;
    if (pin.slice(0, half) === pin.slice(half)) return -1.5;
  }
  if (pin.length >= 6 && pin.length % 3 === 0) {
    const third = pin.length / 3;
    if (pin.slice(0, third) === pin.slice(third, 2*third) && pin.slice(0, third) === pin.slice(2*third)) return -2;
  }
  return 0;
}

function detectDate(pin) {
  const s = pin.replace(/[^0-9]/g, "");
  if (s.length === 4) {
    const m = parseInt(s.slice(0,2)), d = parseInt(s.slice(2,4));
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) return -0.5;
    const y = parseInt(s);
    if (y >= 1950 && y <= 2030) return -0.5;
  }
  if (s.length === 6) {
    const y = parseInt(s.slice(0,4));
    if (y >= 1950 && y <= 2030) return -0.5;
  }
  return 0;
}

function detectKeyboardPattern(pin) {
  const rows = ["789", "456", "123", "0."];
  const cols = ["147", "258", "369", ".0"];
  for (let i = 0; i < pin.length - 1; i++) {
    const a = pin[i], b = pin[i + 1];
    for (const row of rows) {
      const ia = row.indexOf(a), ib = row.indexOf(b);
      if (ia !== -1 && ib !== -1 && Math.abs(ia - ib) === 1) return -1;
    }
    for (const col of cols) {
      const ia = col.indexOf(a), ib = col.indexOf(b);
      if (ia !== -1 && ib !== -1 && Math.abs(ia - ib) === 1) return -1;
    }
  }
  return 0;
}

export function categorizePasscode(passcode) {
  if (!passcode) return { category: "weak", score: 0 };
  const s = String(passcode).trim();
  if (s.length < 4) return { category: "weak", score: 5 };

  const entropy = calculateEntropy(s);

  // Length-aware baseline — longer = better starting point
  let score;
  if (s.length <= 4)      score = 35;  // 4-digit: tough to be strong
  else if (s.length <= 6) score = 45;  // 6-digit: moderate baseline
  else if (s.length <= 8) score = 55;  // 8-digit: good baseline
  else                    score = 60;  // 9+: strong baseline

  // Entropy bonus — sab lengths ke liye
  const entropyBonus = Math.min(25, entropy * 0.6);
  score += entropyBonus;

  // Alphanumeric/symbol bonus — PIN mein letters/symbols = much stronger
  const hasLower  = /[a-z]/.test(s);
  const hasUpper  = /[A-Z]/.test(s);
  const hasDigit  = /[0-9]/.test(s);
  const hasSymbol = /[^a-zA-Z0-9]/.test(s);
  const variety   = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;

  if (variety >= 4) score += 15;
  else if (variety === 3) score += 10;
  else if (variety === 2) score += 5;

  // Pattern penalties
  if (COMMON_PINS.has(s.toLowerCase())) score -= 35;

  const repeats = detectRepeats(s);
  if (repeats <= -2) score -= 25;
  else if (repeats === -1) score -= 10;

  const seq = detectSequence(s);
  if (seq === 2) score -= 20;
  else if (seq === 1) score -= 10;

  if (isPalindrome(s)) score -= 10;
  score += detectRepeatedChunk(s);
  score += detectDate(s);
  score += detectKeyboardPattern(s);

  // No patterns bonus
  const noPatterns =
    repeats === 0 && seq === 0 &&
    !COMMON_PINS.has(s.toLowerCase()) &&
    !isPalindrome(s) &&
    detectRepeatedChunk(s) === 0 &&
    detectDate(s) === 0 &&
    detectKeyboardPattern(s) === 0;
  if (noPatterns) score += 8;

  const percentage = Math.round(Math.min(100, Math.max(0, score)));

  let category;
  if (percentage < 35)      category = "weak";
  else if (percentage < 65) category = "moderate";
  else                      category = "strong";

  return { category, score: percentage };
}