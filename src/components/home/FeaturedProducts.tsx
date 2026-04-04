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
import { useStore } from "@/context/StoreContext";

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
  const { settings } = useStore();

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [settingsRes, prodRes] = await Promise.all([
          fetch("/api/admin/landing"),
          fetch("/api/products")
        ]);

        if (!prodRes.ok) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const settingsData = await settingsRes.json();
        const allProducts = await prodRes.json();

        if (settingsData?.featuredIds?.length > 0) {
          const featured = settingsData.featuredIds
            .map((id: string) => allProducts.find((p: any) => p.id === id))
            .filter(Boolean);
          setProducts(featured);
        } else {
          const featured = allProducts.filter((p: any) => p.featured);
          setProducts(featured.length > 0 ? featured : allProducts.slice(0, 8));
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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(products.length / 4));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(products.length / 4)) % Math.ceil(products.length / 4));
  };

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const showCarousel = products.length > 4;
  const visibleProducts = showCarousel
    ? products.slice(currentIndex * 4, (currentIndex * 4) + 4)
    : products.slice(0, 4);

  return (
    <section className="py-16 lg:py-24 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <span className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">
              Curated Selection
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mt-4">
              Featured Timepieces
            </h2>
          </motion.div>

          {showCarousel && (
            <div className="flex gap-3">
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-2xl border-2 border-border/50 flex items-center justify-center hover:border-primary hover:text-primary transition-all group active:scale-95"
              >
                <ChevronRight className="w-6 h-6 rotate-180" />
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-2xl border-2 border-border/50 flex items-center justify-center hover:border-primary hover:text-primary transition-all group active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Products Grid / Carousel */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {visibleProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
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
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">{settings.currencySymbol}{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through decoration-primary/30">
                      {settings.currencySymbol}{product.originalPrice}
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
