import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "KREZOEMA — Creative Craft & Handmade Accessories",
    template: "%s | KREZOEMA",
  },
  description:
    "Dari kreativitas menjadi karya, dari karya menjadi identitas. Studio kerajinan kreatif dan aksesoris handmade est. 2017.",
  keywords: [
    "KREZOEMA",
    "Creative Craft",
    "Handmade Accessories",
    "Manik Kaca",
    "Mutiara",
    "Akrilik",
    "Aksesoris Handmade Indonesia",
  ],
  authors: [{ name: "KREZOEMA" }],
  creator: "KREZOEMA",
  icons: {
    icon: "/logo-krezoema.png",
    apple: "/logo-krezoema.png",
  },
  openGraph: {
    title: "KREZOEMA — Creative Craft & Handmade Accessories",
    description:
      "Dari kreativitas menjadi karya, dari karya menjadi identitas. Studio kerajinan kreatif dan aksesoris handmade est. 2017.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${playfair.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-brand-pink-soft selection:text-brand-pink-dark">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
