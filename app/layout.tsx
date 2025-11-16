import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Doctor Model Builder",
  description: "Create a structured doctor model for your video",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="app-header">
            <div className="brand">
              <img src="/vercel.svg" alt="logo" width={24} height={24} />
              <span>Doctor Model Builder</span>
            </div>
            <nav className="app-nav">
              <a href="https://agentic-4da0146c.vercel.app" target="_blank" rel="noreferrer">Live</a>
              <a href="https://vercel.com" target="_blank" rel="noreferrer">Vercel</a>
            </nav>
          </header>
          <main className="app-main">{children}</main>
          <footer className="app-footer">? {new Date().getFullYear()} Doctor Model Builder</footer>
        </div>
      </body>
    </html>
  );
}
