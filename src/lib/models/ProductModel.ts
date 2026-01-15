import { prisma } from "../prisma";

export interface ProductData {
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    description?: string;
    images: string[];
    categoryId: string;
    badge?: string;
    featured?: boolean;
    specifications?: any;
    variants?: any;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
}

export class ProductModel {
    static async getAll() {
        return prisma.product.findMany({
            include: {
                category: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    static async getById(id: string) {
        return prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                reviews: true,
            },
        });
    }

    static async getByCategory(categorySlug: string) {
        return prisma.product.findMany({
            where: {
                category: {
                    slug: categorySlug,
                },
            },
            include: {
                category: true,
            },
        });
    }

    static async create(data: ProductData) {
        return prisma.product.create({
            data,
        });
    }

    static async update(id: string, data: Partial<ProductData>) {
        return prisma.product.update({
            where: { id },
            data,
        });
    }

    static async delete(id: string) {
        return prisma.product.delete({
            where: { id },
        });
    }
}
