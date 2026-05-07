import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rudin-Repo // Math Archive",
  description: "Archivo minimalista E-Ink para Principles of Mathematical Analysis",
  icons: {
    icon: "/image.png",
    apple: "/image.png",
  },
  openGraph: {
    title: "Rudin-Repo // Math Archive",
    description: "Digital curation of Rudin's Principles of Mathematical Analysis",
    images: [
      {
        url: "/image.png",
        width: 800,
        height: 800,
        alt: "Rudin Repo Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rudin-Repo // Math Archive",
    description: "Minimalist Math Archive for PMA",
    images: ["/image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
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
