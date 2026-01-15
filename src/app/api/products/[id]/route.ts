import { ProductController } from "@/controllers/ProductController";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return ProductController.getById(id);
}
