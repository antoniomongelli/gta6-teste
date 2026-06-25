import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import NewsTicker from "@/components/NewsTicker";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "GTA6.NEWS — Central de Notícias do GTA VI em PT-BR",
  description: "Tudo sobre Grand Theft Auto VI: notícias, leaks, informações oficiais, galeria e wiki. Atualizado em tempo real.",
  keywords: ["GTA 6", "GTA VI", "Grand Theft Auto", "Rockstar", "Vice City", "Lucia", "Jason"],
  openGraph: {
    title: "GTA6.NEWS",
    description: "A central de notícias sobre GTA VI mais completa do Brasil",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#07020f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Navbar />
        <NewsTicker />
        <main>{children}</main>
        <BottomNav />
        <footer style={{ borderTop: "1px solid rgba(130,96,146,0.15)", marginTop: 60, padding: "28px 24px", textAlign: "center" }}>
          <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: 2, color: "#E39986", marginBottom: 6 }}>
            GTA6<span style={{ color: "#826092" }}>.</span>NEWS
          </div>
          <p style={{ color: "#333", fontSize: 11 }}>
            Site não oficial · Conteúdo de fãs · Não afiliado à Rockstar Games
          </p>
        </footer>
      </body>
    </html>
  );
}
