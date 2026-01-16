import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export class SettingsController {
    static async getSettings() {
        try {
            const model = (prisma as any).storeSettings;
            if (!model) throw new Error("storeSettings model not found in Prisma Client");

            let settings = await model.findUnique({
                where: { id: "singleton" }
            });

            if (!settings) {
                // Initialize defaults if not exists
                settings = await model.create({
                    data: {
                        id: "singleton",
                        currency: "USD",
                        currencySymbol: "$",
                        taxPercentage: 0,
                        shippingFlatRate: 0,
                        orderEmailSubject: "New Order Received",
                        orderEmailBody: "<h1>New Order!</h1><p>You have received a new order on your store.</p>",
                        maintenanceMode: false,
                        whatsappNotify: true,
                        whatsappNumber: "+92 300 1234567",
                        siteTitle: "Watch Store - Premium Timepieces",
                        siteDescription: "Discover the finest luxury watches from top brands.",
                        keywords: "watches, luxury watches, premium watches, buy watches"
                    }
                });
            }

            return NextResponse.json(settings);
        } catch (error: any) {
            console.error("SettingsController GET Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    static async updateSettings(data: any) {
        try {
            const model = (prisma as any).storeSettings;
            if (!model) throw new Error("storeSettings model not found in Prisma Client");

            const settings = await model.upsert({
                where: { id: "singleton" },
                update: data,
                create: {
                    id: "singleton",
                    currency: "USD",
                    currencySymbol: "$",
                    taxPercentage: 0,
                    shippingFlatRate: 0,
                    orderEmailSubject: "New Order Received",
                    orderEmailBody: "<h1>New Order!</h1><p>You have received a new order on your store.</p>",
                    maintenanceMode: false,
                    whatsappNotify: true,
                    whatsappNumber: "+92 300 1234567",
                    siteTitle: "Watch Store - Premium Timepieces",
                    siteDescription: "Discover the finest luxury watches from top brands.",
                    keywords: "watches, luxury watches, premium watches, buy watches",
                    ...data
                }
            });

            return NextResponse.json(settings);
        } catch (error: any) {
            console.error("SettingsController UPDATE Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
