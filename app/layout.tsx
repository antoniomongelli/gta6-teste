import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import NewsTicker from "@/components/NewsTicker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GTA6.NEWS — Central de Notícias do GTA VI em PT-BR",
  description: "Tudo sobre Grand Theft Auto VI: notícias, leaks, informações oficiais, galeria e wiki.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className} style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh" }}>
        <Navbar />
        <NewsTicker />
        <main>{children}</main>
        <footer style={{ borderTop: "1px solid #1a1a1a", marginTop: 60, padding: "30px 24px", textAlign: "center" }}>
          <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: 2, color: "#E39986", marginBottom: 8 }}>
            GTA6<span style={{ color: "#826092" }}>.</span>NEWS
          </div>
          <p style={{ color: "#444", fontSize: 12 }}>
            Site não oficial · Conteúdo de fãs · Não afiliado à Rockstar Games
          </p>
        </footer>
      </body>
    </html>
  );
}
