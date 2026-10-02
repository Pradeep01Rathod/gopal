import express from "express";
import cors from "cors";
import { analyzeReview } from "./detector.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    name: "AI Fake Review Detector / ReviewGuard AI",
    status: "online",
    message: "Backend is running successfully"
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is running successfully",
    timestamp: new Date().toISOString()
  });
});

// API test route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend API is working"
  });
});

// Analyze review endpoint
app.post("/api/analyze", (req, res) => {
  const { text, rating } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Review text is required." });
  }

  const analysis = analyzeReview(text, rating);
  res.json(analysis);
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.url}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log("=========================================");
  console.log("  AI Fake Review Detector Backend Started");
  console.log(`  Local: http://localhost:${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/api/health`);
  console.log(`  Test:   http://localhost:${PORT}/api/test`);
  console.log(`  Analyze: POST http://localhost:${PORT}/api/analyze`);
  console.log("=========================================");
});