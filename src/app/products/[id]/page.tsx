"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Watch3DViewer } from "@/components/product/Watch3DViewer";
import {
    Heart,
    ShoppingBag,
    Star,
    ChevronRight,
    Home,
    Truck,
    Shield,
    RefreshCcw,
    Minus,
    Plus,
    Check,
    Box,
    MessageCircle,
    CheckCircle2
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";

export default function ProductDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAddedToCart, setIsAddedToCart] = useState(false);
    const [view3D, setView3D] = useState(true);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) throw new Error("Product not found");
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: quantity,
            variant: "Standard" // Can be expanded for actual variants
        });
        setIsAddedToCart(true);
        setTimeout(() => setIsAddedToCart(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Product Not Found</h1>
                <Link href="/products" className="text-primary hover:underline">
                    Back to Shop
                </Link>
            </div>
        );
    }

    const features = [
        { icon: Truck, title: "Free Shipping", description: "On orders over $150" },
        { icon: Shield, title: "2 Year Warranty", description: "Full coverage included" },
        { icon: RefreshCcw, title: "30 Day Returns", description: "Hassle-free process" },
    ];

    return (
        <div className="min-h-screen bg-background">
            <main>
                {/* Breadcrumb */}
                <div className="border-b border-border/50 py-4">
                    <div className="container mx-auto px-4">
                        <nav className="flex items-center gap-2 text-xs tracking-wider uppercase flex-wrap">
                            <Link href="/" className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                                <Home className="w-3.5 h-3.5" />
                                Home
                            </Link>
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                            <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
                                Shop
                            </Link>
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-foreground font-semibold">{product.name}</span>
                        </nav>
                    </div>
                </div>

                {/* Product Section */}
                <section className="py-8 lg:py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
                            {/* Image Gallery */}
                            <div className="space-y-4">
                                {/* View Toggle */}
                                <div className="flex items-center gap-2 mb-2">
                                    <button
                                        onClick={() => setView3D(true)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${view3D
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        <Box className="w-4 h-4" />
                                        360° View
                                    </button>
                                    <button
                                        onClick={() => setView3D(false)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!view3D
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        Gallery
                                    </button>
                                </div>

                                {view3D ? (
                                    <Watch3DViewer image={product.images[0]} name={product.name} />
                                ) : (
                                    <>
                                        <motion.div
                                            key={selectedImage}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="aspect-square bg-muted rounded-3xl flex items-center justify-center p-8"
                                        >
                                            <motion.img
                                                src={product.images[selectedImage]}
                                                alt={product.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </motion.div>

                                        <div className="flex gap-4">
                                            {product.images.map((image: string, index: number) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedImage(index)}
                                                    className={`w-20 h-20 rounded-xl bg-muted flex items-center justify-center p-2 transition-all ${selectedImage === index
                                                        ? "ring-2 ring-primary"
                                                        : "opacity-60 hover:opacity-100"
                                                        }`}
                                                >
                                                    <motion.img
                                                        src={image}
                                                        alt={`${product.name} view ${index + 1}`}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="lg:py-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <span className="text-primary font-medium text-sm">
                                        {product.category?.name}
                                    </span>

                                    <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
                                        {product.name}
                                    </h1>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${i < Math.floor(product.rating)
                                                        ? "fill-gold text-gold"
                                                        : "fill-muted text-muted"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-foreground font-medium">{product.rating}</span>
                                        <span className="text-muted-foreground mr-2">({product.reviewCount || 0} reviews)</span>
                                    </div>

                                    <div className="flex items-baseline gap-3 mb-8">
                                        <span className="text-3xl font-bold text-foreground">${product.price}</span>
                                        {product.originalPrice && (
                                            <>
                                                <span className="text-xl text-muted-foreground line-through">
                                                    ${product.originalPrice}
                                                </span>
                                                <span className="px-2 py-1 bg-accent/10 text-accent text-sm font-medium rounded">
                                                    Save ${product.originalPrice - product.price}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <p className="text-muted-foreground mb-8 leading-relaxed">
                                        {product.description || "This exceptional timepiece combines timeless elegance with modern precision. Crafted with premium materials and Swiss movement technology, it's designed to be your trusted companion for every occasion."}
                                    </p>

                                    {/* Dynamic Specifications */}
                                    {product.specifications && (
                                        <div className="space-y-3 mb-8 p-4 bg-muted rounded-xl">
                                            {Object.entries(product.specifications).map(([key, value]) => (
                                                <div key={key} className="flex justify-between">
                                                    <span className="text-muted-foreground capitalize">{key}</span>
                                                    <span className="text-foreground font-medium">{String(value)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Quantity */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="text-foreground font-medium">Quantity</span>
                                        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-card transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-10 text-center font-medium">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-card transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-4 mb-8">
                                        <Button
                                            size="lg"
                                            className="flex-1 gap-2 font-sans"
                                            onClick={handleAddToCart}
                                        >
                                            {isAddedToCart ? (
                                                <>
                                                    <Check className="w-5 h-5" />
                                                    Added to Cart!
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingBag className="w-5 h-5" />
                                                    Add to Cart
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            size="lg"
                                            variant={isInWishlist(product.id) ? "default" : "outline"}
                                            className={`w-14 transition-all ${isInWishlist(product.id) ? "bg-primary text-primary-foreground" : ""}`}
                                            onClick={() => toggleWishlist({
                                                id: product.id,
                                                name: product.name,
                                                price: product.price,
                                                image: product.images[0]
                                            })}
                                        >
                                            <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                                        </Button>
                                    </div>

                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        className="w-full mb-8 font-sans gap-2"
                                        asChild
                                    >
                                        <Link href={`https://wa.me/1234567890?text=${encodeURIComponent(`I'm interested in the ${product?.name}. Can you provide more details?`)}`} target="_blank">
                                            <MessageCircle className="w-5 h-5" />
                                            Inquire on WhatsApp
                                        </Link>
                                    </Button>

                                    {/* Features */}
                                    <div className="grid grid-cols-3 gap-4">
                                        {features.map((feature) => (
                                            <div key={feature.title} className="text-center">
                                                <div className="w-12 h-12 mx-auto rounded-xl bg-muted flex items-center justify-center mb-2">
                                                    <feature.icon className="w-5 h-5 text-primary" />
                                                </div>
                                                <h4 className="text-sm font-medium text-foreground">{feature.title}</h4>
                                                <p className="text-xs text-muted-foreground">{feature.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Reviews Section */}
                <section className="py-20 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row gap-16">
                            {/* Review Summary */}
                            <div className="lg:w-1/3 space-y-8">
                                <h2 className="font-display text-4xl font-bold">Collector Insights</h2>
                                <div className="p-10 bg-white dark:bg-card rounded-[3rem] shadow-soft border border-border/50">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="text-6xl font-bold font-display">{product.rating}</div>
                                        <div>
                                            <div className="flex items-center gap-1 mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-gold text-gold" : "fill-muted text-muted"}`} />
                                                ))}
                                            </div>
                                            <p className="text-muted-foreground font-medium">Based on {product.reviewCount || 0} reviews</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {[5, 4, 3, 2, 1].map((rating) => (
                                            <div key={rating} className="flex items-center gap-4 group cursor-pointer">
                                                <span className="text-sm font-bold w-3">{rating}</span>
                                                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gold transition-all duration-1000"
                                                        style={{ width: `${rating === 5 ? 85 : rating === 4 ? 10 : 5}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                                                    {rating === 5 ? (product.reviewCount * 0.85).toFixed(0) : rating === 4 ? (product.reviewCount * 0.1).toFixed(0) : (product.reviewCount * 0.05).toFixed(0)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button className="w-full h-14 rounded-2xl mt-10 font-bold shadow-lg shadow-primary/10">
                                        Write a Review
                                    </Button>
                                </div>
                            </div>

                            {/* Review List */}
                            <div className="lg:w-2/3 space-y-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-lg font-bold">Verified Purchases</div>
                                    <select className="bg-transparent text-sm font-bold border-none focus:ring-0 cursor-pointer">
                                        <option>Most Recent</option>
                                        <option>Highest Rated</option>
                                        <option>Lowest Rated</option>
                                    </select>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        {
                                            user: "James W.",
                                            rating: 5,
                                            date: "October 12, 2023",
                                            comment: "The craftsmanship is unparalleled for this price point. The movement is smooth and the bezel click is very satisfying. Truly a grail watch for any collector."
                                        },
                                        {
                                            user: "Sarah M.",
                                            rating: 5,
                                            date: "September 28, 2023",
                                            comment: "Exquisite design. It looks even better in person than in the 360 view. The packaging was also premium, arriving in a beautiful wooden box."
                                        }
                                    ].map((review, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            className="p-8 bg-white dark:bg-card rounded-[2.5rem] border border-border/50 shadow-soft space-y-4"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-1 mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-gold text-gold" : "fill-muted text-muted"}`} />
                                                        ))}
                                                    </div>
                                                    <div className="font-bold flex items-center gap-2">
                                                        {review.user}
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">Verified</span>
                                                    </div>
                                                </div>
                                                <span className="text-sm text-muted-foreground">{review.date}</span>
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed italic">"{review.comment}"</p>
                                        </motion.div>
                                    ))}
                                </div>

                                <Button variant="outline" className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-xs">
                                    Load More Reviews
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
