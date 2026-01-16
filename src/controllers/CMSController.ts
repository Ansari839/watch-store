import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export class CMSController {
    static async getSettings() {
        try {
            let settings = await prisma.landingPageSettings.findUnique({
                where: { id: "singleton" }
            });

            if (!settings) {
                settings = await prisma.landingPageSettings.create({
                    data: {
                        id: "singleton",
                        heroProductIds: [],
                        featuredIds: []
                    }
                });
            }

            return NextResponse.json(settings);
        } catch (error: any) {
            console.error("CMS GET Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    static async updateSettings(req: Request) {
        try {
            const body = await req.json();
            const { heroProductIds, featuredIds, categoryImages, footerEmail, footerPhone, footerAddress, footerSocials } = body;

            const settings = await prisma.landingPageSettings.upsert({
                where: { id: "singleton" },
                update: {
                    heroProductIds,
                    featuredIds,
                    categoryImages,
                    footerEmail,
                    footerPhone,
                    footerAddress,
                    footerSocials
                },
                create: {
                    id: "singleton",
                    heroProductIds: heroProductIds || [],
                    featuredIds: featuredIds || [],
                    categoryImages,
                    footerEmail,
                    footerPhone,
                    footerAddress,
                    footerSocials
                }
            });

            return NextResponse.json(settings);
        } catch (error: any) {
            console.error("CMS UPDATE Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
