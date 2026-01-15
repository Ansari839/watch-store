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
        const res = await fetch("/api/products");
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Expected array but received:", data);
          setProducts([]);
          return;
        }

        const featured = data.filter((p: any) => p.featured).slice(0, 4);
        setProducts(featured.length > 0 ? featured : data.slice(0, 4));
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
    <section className="py-16 lg:py-24 bg-background">
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
              <div className="relative bg-card/60 backdrop-blur-xl rounded-3xl p-6 overflow-hidden shadow-soft transition-all duration-500 group-hover:shadow-premium group-hover:-translate-y-2 group-hover:bg-primary/[0.05] border border-border/50">
                {/* Main Link Overlay */}
                <Link href={`/products/${product.id}`} className="absolute inset-0 z-10" />

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-5 left-5 px-3 py-1 text-[10px] font-bold tracking-wider uppercase bg-primary text-white rounded-full z-20 shadow-sm">
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
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all z-20 shadow-lg ${isInWishlist(product.id)
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/90 backdrop-blur-sm text-foreground hover:text-primary"
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                </button>

                {/* Image */}
                <div className="relative aspect-square flex items-center justify-center p-4">
                  <motion.img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                  />
                </div>

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-30 flex gap-2">
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
                    className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Bag
                  </Button>
                  <Link
                    href={`https://wa.me/1234567890?text=${encodeURIComponent(`I'm interested in the ${product.name}`)}`}
                    target="_blank"
                    className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-2xl flex items-center justify-center transition-colors shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MessageCircle className="w-5 h-5" />
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
