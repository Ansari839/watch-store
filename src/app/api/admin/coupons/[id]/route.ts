import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.coupon.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ message: "Coupon deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await req.json();
        const coupon = await prisma.coupon.update({
            where: { id: params.id },
            data,
        });
        return NextResponse.json(coupon);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
    }
}
