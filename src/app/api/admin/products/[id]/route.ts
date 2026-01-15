import { NextResponse } from "next/server";
import { ProductModel } from "@/lib/models/ProductModel";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const product = await ProductModel.update(id, {
            ...body,
            price: body.price ? parseFloat(body.price) : undefined,
            originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : undefined,
        });
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await ProductModel.delete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
