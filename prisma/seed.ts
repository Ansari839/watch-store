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
        // Men's Collection
        { name: "Royal Oak Offshore", slug: "royal-oak-offshore", price: 25000, originalPrice: 28000, images: ["/assets/watches/watch-1.png"], categoryId: men.id, badge: "Bestseller", featured: true, rating: 4.9, reviewCount: 45, specifications: { movement: "Automatic", case: "42mm Titanium", power: "60h" } },
        { name: "Daytona Platinum", slug: "daytona-platinum", price: 35000, originalPrice: 40000, images: ["/assets/watches/watch-4.png"], categoryId: men.id, badge: "Limited", featured: true, rating: 5.0, reviewCount: 32, specifications: { movement: "Chronograph", case: "40mm Platinum", crystal: "Sapphire" } },
        { name: "Seamaster Diver", slug: "seamaster-diver", price: 5200, originalPrice: 6000, images: ["/assets/watches/watch-5.png"], categoryId: men.id, badge: "Popular", featured: false, rating: 4.8, reviewCount: 120, specifications: { movement: "Master Co-Axial", case: "42mm Steel", water: "300m" } },
        { name: "Speedmaster Professional", slug: "speedmaster-pro", price: 6300, images: ["/assets/watches/watch-1.png"], categoryId: men.id, featured: true, rating: 4.9, reviewCount: 210, specifications: { movement: "Manual Wind", case: "42mm Steel", crystal: "Hesalite" } },
        { name: "Aquaracer Night", slug: "aquaracer-night", price: 3200, originalPrice: 3800, images: ["/assets/watches/watch-5.png"], categoryId: men.id, rating: 4.7, reviewCount: 88, specifications: { movement: "Quartz", case: "43mm DLC Steel", water: "300m" } },
        { name: "Santos de Cartier", slug: "santos-cartier", price: 7400, images: ["/assets/watches/watch-4.png"], categoryId: men.id, badge: "Iconic", rating: 4.8, reviewCount: 56, specifications: { movement: "Automatic", case: "Large Steel", crystal: "Sapphire" } },
        { name: "Black Bay 58", slug: "black-bay-58", price: 3800, images: ["/assets/watches/watch-1.png"], categoryId: men.id, featured: true, rating: 4.7, reviewCount: 145, specifications: { movement: "In-house Auto", case: "39mm Steel", power: "70h" } },

        // Women's Elegance
        { name: "Lady-Datejust Diamond", slug: "lady-datejust-diamond", price: 12500, originalPrice: 14000, images: ["/assets/watches/watch-2.png"], categoryId: women.id, badge: "Premium", featured: true, rating: 5.0, reviewCount: 28, specifications: { movement: "Perpetual Auto", case: "28mm Gold", stones: "Diamond" } },
        { name: "Tank Française", slug: "tank-francaise", price: 4200, images: ["/assets/watches/watch-2.png"], categoryId: women.id, badge: "Classic", featured: false, rating: 4.8, reviewCount: 52, specifications: { movement: "Quartz", case: "Medium Steel", crystal: "Sapphire" } },
        { name: "Reverso Duetto", slug: "reverso-duetto", price: 9800, originalPrice: 11000, images: ["/assets/watches/watch-2.png"], categoryId: women.id, featured: true, rating: 4.9, reviewCount: 15, specifications: { movement: "Manual", case: "Rose Gold", features: "Two dials" } },
        { name: "Constellation Star", slug: "constellation-star", price: 5800, images: ["/assets/watches/watch-2.png"], categoryId: women.id, rating: 4.7, reviewCount: 64, specifications: { movement: "Quartz", case: "29mm Steel/Gold", water: "30m" } },
        { name: "Aura Crystal", slug: "aura-crystal", price: 850, originalPrice: 1200, images: ["/assets/watches/watch-2.png"], categoryId: women.id, badge: "New", rating: 4.6, reviewCount: 42, specifications: { movement: "Quartz", case: "32mm Steel", stones: "Swarovski" } },

        // Tech & Innovation
        { name: "Ultra Pro Max", slug: "ultra-pro-max", price: 899, originalPrice: 999, images: ["/assets/watches/watch-3.png"], categoryId: smart.id, badge: "Titanium", featured: true, rating: 4.8, reviewCount: 310, specifications: { display: "OLED", battery: "3 Days", health: "ECG, SPO2" } },
        { name: "Precision Sport", slug: "precision-sport", price: 450, images: ["/assets/watches/watch-3.png"], categoryId: smart.id, rating: 4.5, reviewCount: 185, specifications: { gps: "Dual Band", battery: "14 Days", health: "Heart Rate" } },
        { name: "Vanguard Tech", slug: "vanguard-tech", price: 1200, originalPrice: 1500, images: ["/assets/watches/watch-3.png"], categoryId: smart.id, badge: "Innovative", featured: true, rating: 4.9, reviewCount: 45, specifications: { body: "Ceramic", display: "AMOLED", os: "Custom" } },
        { name: "Nexus Smart", slug: "nexus-smart", price: 299, originalPrice: 399, images: ["/assets/watches/watch-3.png"], categoryId: smart.id, rating: 4.4, reviewCount: 520, specifications: { features: "NFC, BT Call", battery: "10 Days" } },

        // Luxury & Rare (Mixed in Categories)
        { name: "Nautilus Blue", slug: "nautilus-blue", price: 85000, images: ["/assets/watches/watch-4.png"], categoryId: men.id, badge: "Rare", featured: true, rating: 5.0, reviewCount: 12, specifications: { movement: "324 S C", case: "40mm Steel", water: "120m" } },
        { name: "Royal Oak Skeleton", slug: "royal-oak-skeleton", price: 95000, images: ["/assets/watches/watch-1.png"], categoryId: men.id, badge: "Exquisite", rating: 5.0, reviewCount: 8, specifications: { movement: "Skeletonized", case: "Ceramic", power: "45h" } },
        { name: "World Timer", slug: "world-timer", price: 2800, originalPrice: 3500, images: ["/assets/watches/watch-1.png"], categoryId: men.id, rating: 4.6, reviewCount: 38, specifications: { movement: "GMT Auto", regions: "24 Cities", water: "100m" } },
        { name: "Lunar Eclipse", slug: "lunar-eclipse", price: 1500, images: ["/assets/watches/watch-2.png"], categoryId: women.id, badge: "New Arrival", rating: 4.7, reviewCount: 22, specifications: { movement: "Moonphase", case: "38mm Steel", strap: "Satin" } },
        { name: "Carbon X-treme", slug: "carbon-xtreme", price: 4500, originalPrice: 5500, images: ["/assets/watches/watch-5.png"], categoryId: men.id, badge: "Sport", rating: 4.8, reviewCount: 56, specifications: { case: "Carbon Fiber", strap: "Rubber", water: "300m" } },
        { name: "Monaco Gulf", slug: "monaco-gulf", price: 7200, images: ["/assets/watches/watch-4.png"], categoryId: men.id, badge: "Heritage", rating: 4.9, reviewCount: 74, specifications: { movement: "Calibre 11", case: "39mm Square", crystal: "Sapphire" } },
        { name: "Heritage Chrono", slug: "heritage-chrono", price: 4800, originalPrice: 5200, images: ["/assets/watches/watch-4.png"], categoryId: men.id, rating: 4.7, reviewCount: 45, specifications: { movement: "Automatic", case: "41mm Rose Gold", strap: "Alligator" } },
        { name: "Overseas GMT", slug: "overseas-gmt", price: 24000, images: ["/assets/watches/watch-5.png"], categoryId: men.id, featured: true, rating: 4.9, reviewCount: 18, specifications: { movement: "GMT Auto", case: "41mm Gold", water: "150m" } },
        { name: "Grand Luxe", slug: "grand-luxe", price: 3200, originalPrice: 4000, images: ["/assets/watches/watch-2.png"], categoryId: women.id, rating: 4.8, reviewCount: 35, specifications: { stones: "Diamonds", strap: "18k Bracelet" } },
        { name: "Zenith El Primero", slug: "el-primero", price: 8500, images: ["/assets/watches/watch-1.png"], categoryId: men.id, badge: "Precision", rating: 4.9, reviewCount: 55, specifications: { movement: "High-Freq", case: "38mm Steel", crystals: "Sapphire" } }
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
