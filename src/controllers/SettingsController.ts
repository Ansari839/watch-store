import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export class SettingsController {
    static async getSettings() {
        try {
            let settings = await prisma.storeSettings.findUnique({
                where: { id: "singleton" }
            });

            if (!settings) {
                // Initialize defaults if not exists
                settings = await prisma.storeSettings.create({
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
                        whatsappNumber: "+92 300 1234567"
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
            const settings = await prisma.storeSettings.upsert({
                where: { id: "singleton" },
                update: data,
                create: {
                    id: "singleton",
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
