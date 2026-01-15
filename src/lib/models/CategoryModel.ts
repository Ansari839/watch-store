import { prisma } from "../prisma";

export interface CategoryData {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    gradient?: string;
}

export class CategoryModel {
    static async getAll() {
        return prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
    }

    static async getBySlug(slug: string) {
        return prisma.category.findUnique({
            where: { slug },
            include: {
                products: true,
            },
        });
    }

    static async create(data: CategoryData) {
        return prisma.category.create({
            data,
        });
    }
}
