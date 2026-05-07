import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rudin-Repo // Math Archive",
  description: "Minimalist E-Ink archive for Principles of Mathematical Analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-Flash Theme Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="dot-grid">
        {children}
      </body>
    </html>
  );
}
