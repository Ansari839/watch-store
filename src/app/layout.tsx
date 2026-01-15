import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LayoutContent } from "@/components/layout/LayoutContent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Time Capsule Collective | Premium Watch Store",
  description: "Discover the finest collection of luxury timepieces.",
};

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} font-sans bg-background text-foreground antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <LayoutContent>{children}</LayoutContent>
                <Toaster position="top-center" richColors />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
