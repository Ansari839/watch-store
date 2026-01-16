import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const model = (prisma as any).storeSettings;
        if (!model) throw new Error("storeSettings model not found");

        let settings = await model.findUnique({
            where: { id: "singleton" }
        });

        if (!settings) {
            return NextResponse.json({
                currency: "USD",
                currencySymbol: "$",
                whatsappNumber: "+92 300 1234567",
                siteTitle: "Watch Store - Premium Timepieces",
                siteDescription: "Discover the finest luxury watches from top brands.",
                keywords: "watches, luxury watches, premium watches",
                maintenanceMode: false
            });
        }

        // Return only public fields
        return NextResponse.json({
            currency: settings.currency,
            currencySymbol: settings.currencySymbol,
            whatsappNumber: settings.whatsappNumber,
            siteTitle: settings.siteTitle,
            siteDescription: settings.siteDescription,
            keywords: settings.keywords,
            maintenanceMode: settings.maintenanceMode,
            whatsappNotify: settings.whatsappNotify
        });
    } catch (error: any) {
        console.error("Public Settings Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
