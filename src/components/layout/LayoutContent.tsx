"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith("/admin");

    return (
        <>
            {!isAdminPage && <Header />}
            <main className="min-h-screen">{children}</main>
            {!isAdminPage && <Footer />}
        </>
    );
}
