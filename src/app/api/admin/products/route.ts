import { NextResponse } from "next/server";
import { ProductModel } from "@/lib/models/ProductModel";

export async function GET() {
    try {
        const products = await ProductModel.getAll();
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // slug generation logic
        const slug = body.name.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

        const product = await ProductModel.create({
            ...body,
            slug,
            price: parseFloat(body.price),
            originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : undefined,
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Create product error:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
