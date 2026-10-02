"use client";

import { useState, useEffect } from "react";

const SAMPLES = [
  {
    label: "🤖 Bot / Fake (Exaggerated)",
    rating: 5,
    text: "AMAZING PRODUCT!!! Best purchase of my entire life! Outstanding quality, blown away by how incredible this is! 1000% recommended to everybody on earth, you MUST buy it right now! A+++++++!"
  },
  {
    label: "✅ Authentic Customer",
    rating: 4,
    text: "Purchased this wireless headset about two weeks ago. The battery holds up for around 20 hours on a single charge. Sound is clean and crisp with balanced bass. The headband is slightly tight at first, but loosened up comfortably after a few days."
  },
  {
    label: "⚠️ Paid Spam Template",
    rating: 5,
    text: "Very good item. Good seller, fast shipping, works nicely. Item as described. Will buy again from this shop. Five stars."
  }
];

export default function Home() {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/health", { method: "GET" });
      if (res.ok) {
        setBackendStatus("online");
      } else {
        setBackendStatus("offline");
      }
    } catch {
      setBackendStatus("offline");
    }
  };

  const runAnalysis = async (e) => {
    e?.preventDefault();
    if (!reviewText.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      // Attempt backend call
      const res = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: reviewText, rating })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
        setBackendStatus("online");
        setLoading(false);
        return;
      }
    } catch {
      // Backend not responding to POST /api/analyze; use client-side heuristic engine
    }

    // Heuristic analyzer fallback
    const analysis = analyzeClientSide(reviewText, rating);
    setResult(analysis);
    setLoading(false);
  };

  const analyzeClientSide = (text, userRating) => {
    const trimmed = text.trim();
    const words = trimmed.toLowerCase().split(/\s+/);
    const exclamationCount = (text.match(/!/g) || []).length;
    const uppercaseChars = (text.match(/[A-Z]/g) || []).length;
    const capsRatio = uppercaseChars / (text.length || 1);

    const superlatives = ["best ever", "life changing", "greatest", "amazing", "blown away", "must buy", "1000%", "perfect", "flawless"];
    let superlativeMatches = 0;
    superlatives.forEach(term => {
      if (trimmed.toLowerCase().includes(term)) superlativeMatches++;
    });

    const specificTokens = ["battery", "hours", "days", "cable", "material", "button", "fit", "broke", "sound", "size", "color", "quality", "bought"];
    let specificMatches = 0;
    specificTokens.forEach(t => {
      if (words.includes(t)) specificMatches++;
    });

    let fakeScore = 30; // base probability

    if (exclamationCount >= 3) fakeScore += 20;
    if (capsRatio > 0.18) fakeScore += 18;
    if (superlativeMatches >= 2) fakeScore += 25;
    if (words.length < 15 && userRating === 5) fakeScore += 15;
    if (specificMatches >= 2) fakeScore -= 25;
    if (words.length > 30) fakeScore -= 10;

    fakeScore = Math.max(5, Math.min(96, fakeScore));

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
    if (superlativeMatches > 0) reasons.push("Detected excessive generic praise / superlative keywords");
    if (exclamationCount >= 2 || capsRatio > 0.15) reasons.push("High density of exclamations or capitalized urgency");
    if (specificMatches === 0 && words.length < 25) reasons.push("Lacks concrete product attributes or usage context");
    if (specificMatches >= 2) reasons.push("Contains realistic, granular product details");

    return {
      fakeProbability: fakeScore,
      authenticityScore: 100 - fakeScore,
      verdict,
      verdictClass,
      aiConfidence: Math.round(fakeScore * 0.9),
      sentimentExaggeration: Math.min(100, (superlativeMatches * 30) + (exclamationCount * 12)),
      detailScore: Math.min(100, specificMatches * 35 + (words.length > 25 ? 30 : 10)),
      reasons: reasons.length ? reasons : ["Review characteristics appear balanced"]
    };
  };

  const loadSample = (sample) => {
    setReviewText(sample.text);
    setRating(sample.rating);
    setResult(null);
  };

  return (
    <div>
      <section className="hero">
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "0.75rem" }}>
          <span className="badge">⚡ Real-Time NLP Detection</span>
          <span className="status-pill">
            <span className={`dot ${backendStatus === "online" ? "dot-green" : "dot-red"}`}></span>
            Backend: {backendStatus === "online" ? "Connected (Port 5000)" : "Offline / Standalone"}
          </span>
        </div>
        <h1 className="hero-title">ReviewGuard AI</h1>
        <p className="hero-subtitle">
          Detect AI-generated bot reviews, sponsored spam, and manipulative ratings before making a purchasing decision.
        </p>
      </section>

      <div className="card">
        <form onSubmit={runAnalysis}>
          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Review Content</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Rating:</span>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  style={{
                    background: "var(--bg-secondary)",
                    color: "#fff",
                    border: "1px solid var(--border-color)",
                    borderRadius: "6px",
                    padding: "0.2rem 0.5rem"
                  }}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                  <option value={3}>⭐⭐⭐ (3/5)</option>
                  <option value={2}>⭐⭐ (2/5)</option>
                  <option value={1}>⭐ (1/5)</option>
                </select>
              </div>
            </div>

            <textarea
              className="form-textarea"
              placeholder="Paste product review or feedback here to inspect authenticity..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <div className="samples-wrapper">
              <span className="sample-label">Try sample:</span>
              {SAMPLES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="sample-btn"
                  onClick={() => loadSample(sample)}
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !reviewText.trim()}
          >
            {loading ? "Analyzing Review..." : "🛡️ Scan Review Authenticity"}
          </button>
        </form>

        {result && (
          <div className="result-card">
            <div className="verdict-header">
              <div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "0.25rem" }}>
                  VERDICT
                </span>
                <div className={`verdict-badge ${result.verdictClass || (result.fakeProbability >= 65 ? "verdict-fake" : result.fakeProbability >= 40 ? "verdict-suspicious" : "verdict-authentic")}`}>
                  {result.verdict}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block" }}>
                  Fake Probability
                </span>
                <span className="confidence-rate" style={{
                  color: result.fakeProbability >= 65 ? "#ef4444" : result.fakeProbability >= 40 ? "#f59e0b" : "#10b981"
                }}>
                  {result.fakeProbability}%
                </span>
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric-box">
                <div className="metric-title">Authenticity Index</div>
                <div className="metric-val" style={{ color: "#34d399" }}>{result.authenticityScore}%</div>
                <div className="meter-bar">
                  <div className="meter-fill" style={{ width: `${result.authenticityScore}%`, background: "#10b981" }}></div>
                </div>
              </div>

              <div className="metric-box">
                <div className="metric-title">Sentiment Bias / Hype</div>
                <div className="metric-val" style={{ color: "#f87171" }}>{result.sentimentExaggeration}%</div>
                <div className="meter-bar">
                  <div className="meter-fill" style={{ width: `${result.sentimentExaggeration}%`, background: "#ef4444" }}></div>
                </div>
              </div>

              <div className="metric-box">
                <div className="metric-title">Detail & Specificity</div>
                <div className="metric-val" style={{ color: "#38bdf8" }}>{result.detailScore}%</div>
                <div className="meter-bar">
                  <div className="meter-fill" style={{ width: `${result.detailScore}%`, background: "#0ea5e9" }}></div>
                </div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", display: "block", marginBottom: "0.5rem" }}>
                Analysis Breakdown & Key Signals:
              </span>
              <ul className="reasons-list">
                {result.reasons?.map((reason, idx) => (
                  <li key={idx} className="reason-item">
                    <span>•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
