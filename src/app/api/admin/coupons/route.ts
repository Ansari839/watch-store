import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(coupons);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Check if code already exists
        const existing = await prisma.coupon.findUnique({
            where: { code: data.code },
        });

        if (existing) {
            return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: data.code,
                type: data.type,
                value: data.value,
                minPurchase: data.minPurchase || 0,
                usageLimit: data.usageLimit || null,
                expiryDate: data.expiryDate || null,
                isActive: true,
            },
        });

        return NextResponse.json(coupon);
    } catch (error) {
        console.error("Coupon Create Error:", error);
        return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
    }
}
