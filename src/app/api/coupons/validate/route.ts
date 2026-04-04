import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { code, cartTotal } = await req.json();

        if (!code) {
            return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (!coupon) {
            return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
        }

        if (!coupon.isActive) {
            return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
        }

        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
        }

        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
        }

        if (cartTotal < coupon.minPurchase) {
            return NextResponse.json({
                error: `Minimum purchase of $${coupon.minPurchase} required for this coupon`
            }, { status: 400 });
        }

        return NextResponse.json({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value
        });

    } catch (error) {
        console.error("Coupon Validation Error:", error);
        return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
    }
}
