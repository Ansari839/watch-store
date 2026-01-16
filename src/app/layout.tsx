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

import { TrackingScripts } from "@/components/providers/TrackingScripts";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  try {
    // Defensive check for Turbopack caching issues
    const settingsModel = (prisma as any).storeSettings;
    const settings = settingsModel ? await settingsModel.findUnique({ where: { id: "singleton" } }) : null;

    return {
      title: settings?.siteTitle || "Watch Store | Premium Timepieces",
      description: settings?.siteDescription || "Discover the finest collection of luxury timepieces.",
      keywords: settings?.keywords || "watches, luxury, premium",
    };
  } catch (error) {
    console.error("Metadata Generation Error:", error);
    return {
      title: "Watch Store | Premium Timepieces",
      description: "Discover the finest collection of luxury timepieces.",
    };
  }
}

import { StoreProvider } from "@/context/StoreContext";
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
            <StoreProvider>
              <WishlistProvider>
                <CartProvider>
                  <TrackingScripts />
                  <LayoutContent>{children}</LayoutContent>
                  <Toaster position="top-center" richColors />
                </CartProvider>
              </WishlistProvider>
            </StoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
