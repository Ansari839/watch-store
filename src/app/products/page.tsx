"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Heart,
    ShoppingBag,
    Star,
    Filter,
    Grid3X3,
    List,
    ChevronDown,
    ChevronRight,
    Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { useStore } from "@/context/StoreContext";

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}

function ProductsContent() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("all");
    const [activePriceRange, setActivePriceRange] = useState("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [activeMaterial, setActiveMaterial] = useState("all");
    const [activeMovement, setActiveMovement] = useState("all");
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { settings } = useStore();

    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search") || "";

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();

                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error("Expected array but received:", data);
                    setProducts([]);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) => {
        const categoryMatch = activeCategory === "all" || product.category?.slug === activeCategory;
        let priceMatch = true;
        if (activePriceRange === "under300") priceMatch = product.price < 300;
        else if (activePriceRange === "300-500") priceMatch = product.price >= 300 && product.price <= 500;
        else if (activePriceRange === "over500") priceMatch = product.price > 500;

        const searchMatch = !searchQuery ||
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category?.name.toLowerCase().includes(searchQuery.toLowerCase());

        const materialMatch = activeMaterial === "all" || product.material?.toLowerCase() === activeMaterial.toLowerCase();
        const movementMatch = activeMovement === "all" || product.movement?.toLowerCase() === activeMovement.toLowerCase();

        return categoryMatch && priceMatch && searchMatch && materialMatch && movementMatch;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const categories = [
        { id: "all", name: "All Watches" },
        { id: "men", name: "Men's" },
        { id: "women", name: "Women's" },
        { id: "smart", name: "Smart" },
    ];

    const priceRanges = [
        { id: "all", name: "All Prices" },
        { id: "under300", name: `Under ${settings.currencySymbol}300` },
        { id: "300-500", name: `${settings.currencySymbol}300 - ${settings.currencySymbol}500` },
        { id: "over500", name: `Over ${settings.currencySymbol}500` },
    ];

    const materials = [
        { id: "all", name: "All Materials" },
        { id: "stainless steel", name: "Stainless Steel" },
        { id: "gold", name: "Gold" },
        { id: "leather", name: "Leather" },
        { id: "titanium", name: "Titanium" },
    ];

    const movements = [
        { id: "all", name: "All Movements" },
        { id: "automatic", name: "Automatic" },
        { id: "quartz", name: "Quartz" },
        { id: "manual", name: "Manual" },
    ];

    return (
        <div className="min-h-screen bg-transparent">
            <main>
                {/* Breadcrumb */}
                <div className="bg-muted py-4">
                    <div className="container mx-auto px-4">
                        <nav className="flex items-center gap-2 text-sm">
                            <Link href="/" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
                                <Home className="w-4 h-4" />
                                Home
                            </Link>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground font-medium">Shop</span>
                        </nav>
                    </div>
                </div>

                {/* Hero */}
                <section className="bg-muted py-12 lg:py-16">
                    <div className="container mx-auto px-4 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
                        >
                            Our Collection
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-muted-foreground max-w-xl mx-auto"
                        >
                            Discover exceptional timepieces crafted for every style and occasion.
                        </motion.p>
                    </div>
                </section>

                {/* Filters & Products */}
                <section className="py-8 lg:py-12">
                    <div className="container mx-auto px-4">
                        {/* Toolbar */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-4 flex-wrap">
                                {/* Category Filters */}
                                <div className="flex items-center gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === cat.id
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground hover:text-foreground"
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>

                                {/* Mobile Filter Button */}
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="md:hidden flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm"
                                >
                                    <Filter className="w-4 h-4" />
                                    Filters
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Price Filter */}
                                <div className="relative hidden md:block">
                                    <select
                                        value={activePriceRange}
                                        onChange={(e) => setActivePriceRange(e.target.value)}
                                        className="appearance-none px-4 py-2 pr-10 bg-muted rounded-lg text-sm text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        {priceRanges.map((range) => (
                                            <option key={range.id} value={range.id}>
                                                {range.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>

                                {/* Material Filter */}
                                <div className="relative hidden lg:block">
                                    <select
                                        value={activeMaterial}
                                        onChange={(e) => setActiveMaterial(e.target.value)}
                                        className="appearance-none px-4 py-2 pr-10 bg-muted rounded-lg text-sm text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        {materials.map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>

                                {/* Movement Filter */}
                                <div className="relative hidden lg:block">
                                    <select
                                        value={activeMovement}
                                        onChange={(e) => setActiveMovement(e.target.value)}
                                        className="appearance-none px-4 py-2 pr-10 bg-muted rounded-lg text-sm text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        {movements.map((move) => (
                                            <option key={move.id} value={move.id}>
                                                {move.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>

                                {/* View Mode */}
                                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-2 rounded ${viewMode === "grid" ? "bg-card shadow-soft" : ""}`}
                                    >
                                        <Grid3X3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-2 rounded ${viewMode === "list" ? "bg-card shadow-soft" : ""}`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Filters */}
                        {isFilterOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="md:hidden mb-6 p-4 bg-muted rounded-lg"
                            >
                                <h4 className="font-medium mb-3">Price Range</h4>
                                <div className="flex flex-wrap gap-2">
                                    {priceRanges.map((range) => (
                                        <button
                                            key={range.id}
                                            onClick={() => setActivePriceRange(range.id)}
                                            className={`px-3 py-1.5 rounded text-sm ${activePriceRange === range.id
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-card text-foreground"
                                                }`}
                                        >
                                            {range.name}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Results Count */}
                        <p className="text-sm text-muted-foreground mb-6">
                            Showing {filteredProducts.length} products
                        </p>

                        {/* Products Grid */}
                        <motion.div
                            layout
                            className={viewMode === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                                : "flex flex-col gap-4"
                            }
                        >
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`group ${viewMode === "list" ? "flex gap-6 bg-card p-4 rounded-2xl" : ""}`}
                                >
                                    <Link href={`/products/${product.id}`} className={viewMode === "list" ? "flex gap-6 w-full" : ""}>
                                        <div className={`relative bg-muted rounded-2xl p-6 overflow-hidden ${viewMode === "list" ? "w-32 h-32 shrink-0" : ""}`}>
                                            {product.badge && viewMode === "grid" && (
                                                <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-medium rounded-full z-10 ${product.badge === "Best Seller"
                                                    ? "bg-gradient-hero text-primary-foreground"
                                                    : product.badge === "New"
                                                        ? "bg-secondary text-secondary-foreground"
                                                        : "bg-gradient-gold text-foreground"
                                                    }`}>
                                                    {product.badge}
                                                </span>
                                            )}

                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleWishlist({
                                                        id: product.id,
                                                        name: product.name,
                                                        price: product.price,
                                                        image: product.images[0]
                                                    });
                                                }}
                                                className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all z-10 shadow-soft ${isInWishlist(product.id)
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-card text-foreground hover:text-accent opacity-0 group-hover:opacity-100"
                                                    }`}
                                            >
                                                <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                                            </button>

                                            <div className={`${viewMode === "list" ? "w-full h-full" : "aspect-square"} flex items-center justify-center`}>
                                                <motion.img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-4/5 h-4/5 object-contain transition-transform duration-300 group-hover:scale-110"
                                                />
                                            </div>

                                            {viewMode === "grid" && (
                                                <motion.div
                                                    className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Button className="w-full gap-2 font-sans" size="sm">
                                                        <ShoppingBag className="w-4 h-4" />
                                                        Quick Add
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </div>

                                        <div className={viewMode === "list" ? "flex-1 flex flex-col justify-center" : "mt-4 space-y-2"}>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-gold text-gold" />
                                                <span className="text-sm font-medium text-foreground">{product.rating}</span>
                                                <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
                                            </div>

                                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                {product.name}
                                            </h3>

                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-semibold text-foreground">{settings.currencySymbol}{product.price}</span>
                                                {product.originalPrice && (
                                                    <span className="text-sm text-muted-foreground line-through">
                                                        {settings.currencySymbol}{product.originalPrice}
                                                    </span>
                                                )}
                                            </div>

                                            {viewMode === "list" && (
                                                <Button className="mt-4 w-fit gap-2 font-sans" size="sm">
                                                    <ShoppingBag className="w-4 h-4" />
                                                    Add to Cart
                                                </Button>
                                            )}
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
}
