"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShoppingBag,
  Star,
  ChevronRight,
  Heart,
  ArrowRight,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Fetch CMS settings and products in parallel
        const [settingsRes, prodRes] = await Promise.all([
          fetch("/api/admin/landing"),
          fetch("/api/products")
        ]);

        if (!prodRes.ok) {
          console.error(`API returned status ${prodRes.status}`);
          setProducts([]);
          setLoading(false);
          return;
        }

        const settings = await settingsRes.json();
        const allProducts = await prodRes.json();

        if (!Array.isArray(allProducts)) {
          console.error("Expected array but received:", allProducts);
          setProducts([]);
          setLoading(false);
          return;
        }

        if (settings?.featuredIds?.length > 0) {
          // Use CMS selected products
          const featured = settings.featuredIds
            .map((id: string) => allProducts.find((p: any) => p.id === id))
            .filter(Boolean);
          setProducts(featured);
        } else {
          // Fallback to products marked 'featured' in DB
          const featured = allProducts.filter((p: any) => p.featured).slice(0, 4);
          setProducts(featured.length > 0 ? featured : allProducts.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-transparent relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">
            Curated Selection
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Featured Timepieces
          </h2>
          <div className="w-20 h-1 bg-primary/20 mx-auto rounded-full mb-8" />
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover our collection of exceptional watches, chosen for their distinctive character,
            unrivaled precision, and timeless luxury.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group"
            >
              {/* Product Card Container */}
              <div className="relative bg-card/80 backdrop-blur-2xl rounded-[2.5rem] p-6 overflow-hidden shadow-soft transition-all duration-500 group-hover:shadow-premium group-hover:-translate-y-3 group-hover:bg-primary/[0.08] border-2 border-border/70 group-hover:border-primary/30">
                {/* Main Link Overlay */}
                <Link href={`/products/${product.id}`} className="absolute inset-0 z-10" />

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-6 left-6 px-4 py-1.5 text-[10px] font-bold tracking-wider uppercase bg-primary text-white rounded-full z-20 shadow-md">
                    {product.badge}
                  </span>
                )}

                {/* Wishlist */}
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
                  className={`absolute top-6 right-6 w-11 h-11 rounded-full flex items-center justify-center transition-all z-20 shadow-xl ${isInWishlist(product.id)
                    ? "bg-primary text-primary-foreground"
                    : "bg-white backdrop-blur-md text-foreground hover:text-primary border border-border/50"
                    }`}
                >
                  <Heart className={`w-5.5 h-5.5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                </button>

                {/* Image */}
                <div className="relative aspect-square flex items-center justify-center p-6">
                  <motion.img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-115 group-hover:-rotate-3"
                  />
                  {/* Image Glow */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-3xl" />
                </div>

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-30 flex gap-3">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0],
                        quantity: 1
                      });
                    }}
                    className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-2xl gap-2 font-bold"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Bag
                  </Button>
                  <Link
                    href={`https://wa.me/1234567890?text=${encodeURIComponent(`I'm interested in the ${product.name}`)}`}
                    target="_blank"
                    className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl flex items-center justify-center transition-colors shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MessageCircle className="w-6 h-6" />
                  </Link>
                </div>
              </div>

              {/* Info */}
              <Link href={`/products/${product.id}`} className="mt-6 flex flex-col items-center text-center group">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3 h-3 ${s <= Math.floor(product.rating) ? "fill-gold text-gold" : "fill-muted text-muted"}`} />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-foreground/80">{product.rating}</span>
                </div>

                <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300 mb-1">
                  {product.name}
                </h3>

                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through decoration-primary/30">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild variant="outline" size="lg">
            <Link href="/products">View All Watches</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
