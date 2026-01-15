import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // Clean up
    await prisma.user.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.review.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    // Create Admin User
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
        data: {
            name: "Admin User",
            email: "abdullahansari839@gmail.com",
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    console.log("Admin user created: abdullahansari839@gmail.com / admin123");

    // Categories
    const men = await prisma.category.create({
        data: {
            name: "Men's Collection",
            slug: "men",
            description: "Exceptional timepieces for the modern man.",
            image: "/assets/watches/watch-1.png",
            gradient: "from-blue-600 to-indigo-700",
        },
    });

    const women = await prisma.category.create({
        data: {
            name: "Women's Elegance",
            slug: "women",
            description: "Sophisticated watches that define grace.",
            image: "/assets/watches/watch-2.png",
            gradient: "from-rose-500 to-pink-600",
        },
    });

    const smart = await prisma.category.create({
        data: {
            name: "Tech & Innovation",
            slug: "smart",
            description: "The future of timekeeping on your wrist.",
            image: "/assets/watches/watch-3.png",
            gradient: "from-cyan-500 to-blue-500",
        },
    });

    // Products
    const products = [
        {
            name: "Classic Silver Edition",
            slug: "classic-silver",
            price: 299,
            originalPrice: 399,
            images: ["/assets/watches/watch-1.png", "/assets/watches/watch-2.png"],
            description: "A timeless masterpiece featuring a stainless steel case and genuine leather strap.",
            badge: "Best Seller",
            featured: true,
            categoryId: men.id,
            rating: 4.8,
            reviewCount: 124,
            specifications: {
                movement: "Swiss Quartz",
                case: "42mm Stainless Steel",
                water: "100m",
            },
        },
        {
            name: "Rose Gold Elegance",
            slug: "rose-gold-elegance",
            price: 449,
            images: ["/assets/watches/watch-2.png", "/assets/watches/watch-1.png"],
            description: "Graceful and elegant, this rose gold timepiece is the perfect accessory for any occasion.",
            badge: "New",
            featured: true,
            categoryId: women.id,
            rating: 4.9,
            reviewCount: 89,
            specifications: {
                movement: "Automatic",
                case: "36mm Rose Gold",
                water: "50m",
            },
        },
        {
            name: "Tech Pro Smart",
            slug: "tech-pro-smart",
            price: 399,
            originalPrice: 499,
            images: ["/assets/watches/watch-3.png", "/assets/watches/watch-5.png"],
            description: "Stay connected with style. Our most advanced smartwatch yet.",
            categoryId: smart.id,
            rating: 4.7,
            reviewCount: 256,
            specifications: {
                display: "AMOLED 1.4\"",
                battery: "7 Days",
                health: "Full Sensor Suite",
            },
        },
        {
            name: "Golden Chronograph",
            slug: "golden-chronograph",
            price: 599,
            images: ["/assets/watches/watch-4.png"],
            description: "Precision meets luxury in this stunning golden chronograph.",
            badge: "Premium",
            featured: true,
            categoryId: men.id,
            rating: 5.0,
            reviewCount: 67,
            specifications: {
                movement: "Chronograph Quartz",
                case: "44mm Gold Plated",
                water: "200m",
            },
        },
        {
            name: "Dive Master Pro",
            slug: "dive-master-pro",
            price: 549,
            images: ["/assets/watches/watch-5.png", "/assets/watches/watch-3.png"],
            description: "Built for the deep. The ultimate diver's watch with unparalleled durability.",
            categoryId: men.id,
            rating: 4.6,
            reviewCount: 143,
            specifications: {
                movement: "Automatic",
                case: "45mm Titanium",
                water: "500m",
            },
        },
    ];

    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
    }

    console.log("Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
