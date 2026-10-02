/**
 * ReviewGuard AI - Heuristic & NLP Rule-Based Fake Review Detection Engine
 */

const SUPERLATIVES = [
  "best ever", "life changing", "greatest", "amazing", "blown away", 
  "must buy", "1000%", "perfect", "flawless", "miracle", "unbelievable",
  "holy grail", "game changer", "highly recommend to everyone"
];

const GENERIC_PHRASES = [
  "very good item", "good seller", "fast shipping", "item as described",
  "works nicely", "five stars", "a+++", "will buy again", "recommended"
];

const SPECIFIC_INDICATORS = [
  "battery", "battery life", "hours", "days", "cable", "material", "button",
  "fit", "broke", "sound", "size", "color", "quality", "bought", "weeks",
  "months", "setup", "plastic", "metal", "screen", "packaging", "delivery"
];

export function analyzeReview(text, rating = 5) {
  if (!text || typeof text !== "string") {
    return {
      error: "Review text is required"
    };
  }

  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const exclamationCount = (text.match(/!/g) || []).length;
  const uppercaseLetters = (text.match(/[A-Z]/g) || []).length;
  const lettersOnly = (text.match(/[a-zA-Z]/g) || []).length;
  const capsRatio = lettersOnly > 0 ? uppercaseLetters / lettersOnly : 0;

  // 1. Superlatives count
  let superlativeMatches = 0;
  SUPERLATIVES.forEach(phrase => {
    if (lower.includes(phrase)) superlativeMatches++;
  });

  // 2. Generic phrase count
  let genericMatches = 0;
  GENERIC_PHRASES.forEach(phrase => {
    if (lower.includes(phrase)) genericMatches++;
  });

  // 3. Concrete specificity
  let specificMatches = 0;
  SPECIFIC_INDICATORS.forEach(token => {
    if (words.includes(token)) specificMatches++;
  });

  // Scoring logic (base fake score 30%)
  let fakeScore = 30;

  if (exclamationCount >= 3) fakeScore += 18;
  if (capsRatio > 0.2) fakeScore += 16;
  if (superlativeMatches >= 2) fakeScore += 24;
  else if (superlativeMatches === 1) fakeScore += 12;

  if (genericMatches >= 2) fakeScore += 20;

  // Short review with 5 stars and no specifics
  if (wordCount < 15 && rating === 5 && specificMatches === 0) {
    fakeScore += 20;
  }

  // Realistic nuances reduce fake score
  if (specificMatches >= 2) fakeScore -= 22;
  if (specificMatches >= 4) fakeScore -= 12;
  if (wordCount > 30) fakeScore -= 10;
  if (wordCount > 60) fakeScore -= 8;

  // Clamp 5 to 97
  fakeScore = Math.max(5, Math.min(97, fakeScore));
  const authenticityScore = 100 - fakeScore;

  let verdict = "Likely Authentic";
  let verdictClass = "verdict-authentic";
  if (fakeScore >= 65) {
    verdict = "Likely Fake / AI-Generated";
    verdictClass = "verdict-fake";
  } else if (fakeScore >= 40) {
    verdict = "Suspicious / Inconclusive";
    verdictClass = "verdict-suspicious";
  }

  const reasons = [];
  if (superlativeMatches > 0) {
    reasons.push(`Contains high-intensity generic hype words (${superlativeMatches} detected)`);
  }
  if (genericMatches >= 2) {
    reasons.push("Matches templated, repetitive seller feedback phrases");
  }
  if (capsRatio > 0.18 || exclamationCount >= 3) {
    reasons.push("Overuse of capital letters or urgent punctuation");
  }
  if (specificMatches === 0 && wordCount < 25) {
    reasons.push("Lacks real-world usage details or concrete product properties");
  }
  if (specificMatches >= 2) {
    reasons.push(`Contains concrete usage details (${specificMatches} specific features discussed)`);
  }

  return {
    fakeProbability: fakeScore,
    authenticityScore,
    verdict,
    verdictClass,
    wordCount,
    aiConfidence: Math.round(fakeScore * 0.9),
    sentimentExaggeration: Math.min(100, (superlativeMatches * 30) + (exclamationCount * 12)),
    detailScore: Math.min(100, specificMatches * 30 + (wordCount > 25 ? 30 : 10)),
    reasons: reasons.length ? reasons : ["Review characteristics appear balanced"]
  };
}
