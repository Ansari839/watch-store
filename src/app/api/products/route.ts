import { ProductController } from "@/controllers/ProductController";

export async function GET() {
    return ProductController.getAll();
}

export async function POST(req: Request) {
    return ProductController.create(req);
}
