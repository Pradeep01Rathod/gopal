import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "AI Fake Review Detector | ReviewGuard AI",
  description: "Detect AI-generated and fraudulent product reviews with real-time NLP analysis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <Link href="/" className="brand">
            <div className="brand-icon">🛡️</div>
            <span>ReviewGuard AI</span>
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">
              Detector
            </Link>
            <Link href="/login" className="nav-link">
              Sign In
            </Link>
          </div>
        </nav>
        <main className="main-content">
          {children}
        </main>
        <footer className="footer">
          <p>© 2026 ReviewGuard AI • AI-Powered Fake Review Detection System</p>
        </footer>
      </body>
    </html>
  );
}
