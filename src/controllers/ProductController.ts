import { NextResponse } from "next/server";
import { ProductModel } from "@/lib/models/ProductModel";

export class ProductController {
    static async getAll() {
        try {
            const products = await ProductModel.getAll();
            return NextResponse.json(products);
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    static async getById(id: string) {
        try {
            const product = await ProductModel.getById(id);
            if (!product) {
                return NextResponse.json({ error: "Product not found" }, { status: 404 });
            }
            return NextResponse.json(product);
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    static async create(req: Request) {
        try {
            const body = await req.json();
            const product = await ProductModel.create(body);
            return NextResponse.json(product, { status: 201 });
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
