"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Star, ShoppingBag, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { toast } from "sonner";

const watch1 = "/assets/watches/watch-1.png";
const watch2 = "/assets/watches/watch-2.png";
const watch3 = "/assets/watches/watch-3.png";
const watch4 = "/assets/watches/watch-4.png";
const watch5 = "/assets/watches/watch-5.png";

const defaultWatches = [
  { id: "1", images: ["/assets/watches/watch-1.png"], name: "Classic Silver", price: 299, originalPrice: 399, rating: 4.8, badge: "Bestseller", color: "#0D9488" },
  { id: "2", images: ["/assets/watches/watch-2.png"], name: "Rose Elegance", price: 449, originalPrice: 549, rating: 4.9, badge: "New Arrival", color: "#BE123C" },
  { id: "3", images: ["/assets/watches/watch-3.png"], name: "Tech Pro", price: 399, originalPrice: 499, rating: 4.7, badge: "Smart", color: "#1E293B" },
  { id: "4", images: ["/assets/watches/watch-4.png"], name: "Golden Chrono", price: 599, originalPrice: 799, rating: 5.0, badge: "Premium", color: "#B45309" },
  { id: "5", images: ["/assets/watches/watch-5.png"], name: "Dive Master", price: 549, originalPrice: 699, rating: 4.8, badge: "Sport", color: "#0369A1" },
];

export const ClockHeroSlider = () => {
  const [watches, setWatches] = useState<any[]>(defaultWatches);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
    fetchHeroProducts();
  }, []);

  const fetchHeroProducts = async () => {
    try {
      const [settingsRes, prodRes] = await Promise.all([
        fetch("/api/admin/landing"),
        fetch("/api/products")
      ]);

      const settings = await settingsRes.json();
      const allProducts = await prodRes.json();

      if (!Array.isArray(allProducts)) return;

      let heroProducts = [];

      if (settings?.heroProductIds?.length > 0) {
        heroProducts = settings.heroProductIds
          .map((id: string) => allProducts.find((p: any) => p.id === id))
          .filter(Boolean);
      } else {
        // Automatically use latest 5 products as fallback instead of hardcoded defaults
        heroProducts = allProducts.slice(0, 5);
      }

      if (heroProducts.length > 0) {
        const formattedProducts = heroProducts.map((p: any) => ({
          ...p,
          color: p.color || (p.name.includes("Gold") ? "#B45309" : p.name.includes("Pro") ? "#1E293B" : "#065f46"),
          tag: p.badge || "Featured",
          price: p.price, // Ensure price is explicitly passed
          originalPrice: p.originalPrice
        }));
        setWatches(formattedProducts);
      }
    } catch (error) {
      console.error("Hero Slider Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };


  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % watches.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const nextWatch = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % watches.length);
  }, []);

  const prevWatch = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + watches.length) % watches.length);
  }, []);

  const activeWatch = watches[activeIndex];
  const { addToCart } = useCart();
  const { settings } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!activeWatch) return;

    addToCart({
      id: activeWatch.id,
      name: activeWatch.name,
      price: activeWatch.price,
      image: activeWatch.images?.[0] || activeWatch.image,
      quantity: 1
    });

    toast.success(`${activeWatch.name} added to cart!`, {
      description: "Review your selection in the bag.",
      duration: 3000,
      position: "bottom-right",
    });
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.8,
      rotateY: dir > 0 ? 30 : -30,
      filter: "blur(10px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 25,
      } as any
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -500 : 500,
      opacity: 0,
      scale: 1.2,
      rotateY: dir > 0 ? -30 : 30,
      filter: "blur(10px)",
    }),
  };

  return (
    <section className="relative min-h-[100vh] overflow-hidden bg-background">
      {/* Dynamic Gradient Background base */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `radial-gradient(circle at 10% 20%, ${activeWatch.color}50 0%, transparent 70%)`
        }}
        transition={{ duration: 1 }}
      />

      {/* Grid Pattern Utility */}
      <div className="absolute inset-0 bg-grid opacity-90" />

      {/* Floating Glow Orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
        animate={{
          background: `radial-gradient(circle, ${activeWatch.color}95, transparent 70%)`,
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        animate={{
          background: `radial-gradient(circle, hsl(var(--primary) / 0.6), transparent 70%)`,
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Dark Vignette for Depth */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.3)_100%)]" />

      {/* Sparkle Particles */}
      {mounted && [...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary rounded-full"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10 py-8 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 min-h-[100vh] items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left order-2 lg:order-1 space-y-6"
          >
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2"
            >
              <motion.span
                className="px-4 py-2 rounded-full text-sm font-semibold border"
                style={{
                  backgroundColor: `${activeWatch.color}15`,
                  borderColor: `${activeWatch.color}40`,
                  color: activeWatch.color,
                }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨ {activeWatch.tag}
              </motion.span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 justify-center lg:justify-start"
              >
                <div className="h-px w-12 bg-primary/30 hidden lg:block" />
                <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-foreground tracking-tight">Timeless</h1>
              </motion.div>
              <motion.h1
                className="font-display text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span
                  className="bg-clip-text text-transparent italic"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${activeWatch.color}, hsl(var(--primary)))`
                  }}
                >
                  Sophistication
                </span>
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Discover watches that define your style. Premium craftsmanship meets modern design.
            </motion.p>

            {/* Active Watch Details - Glassmorphism Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group/detail max-w-md mx-auto lg:mx-0"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="text-center lg:text-left space-y-1">
                    <h3 className="text-2xl font-bold text-foreground group-hover/detail:text-primary transition-colors">{activeWatch.name}</h3>
                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(activeWatch.rating) ? 'fill-gold text-gold' : 'text-muted-foreground/30'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-muted-foreground">{activeWatch.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center sm:items-end">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black" style={{ color: activeWatch.color }}>
                        {settings.currencySymbol}{activeWatch.price}
                      </span>
                      {activeWatch.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through decoration-primary/30">
                          {settings.currencySymbol}{activeWatch.originalPrice}
                        </span>
                      )}
                    </div>
                    {activeWatch.originalPrice && activeWatch.originalPrice > activeWatch.price && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1">
                        Save {settings.currencySymbol}{activeWatch.originalPrice - activeWatch.price}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="gap-2 text-base group px-8"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 text-base px-8">
                <Link href="/products">
                  <Eye className="w-5 h-5" />
                  View All
                </Link>
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              className="flex flex-wrap items-center gap-6 pt-6 justify-center lg:justify-start text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Free Shipping
              </div>
              {/* <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                2 Year Warranty
              </div> */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                Easy Returns
              </div>
            </motion.div>
          </motion.div>

          {/* Right - 3D Watch Display */}
          <div
            className="relative order-1 lg:order-2 h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center perspective-[1200px]"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              mouseX.set(0);
              mouseY.set(0);
            }}
          >
            {/* Circular Track */}
            <div className="absolute w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] lg:w-[500px] lg:h-[500px] rounded-full border-2 border-dashed border-primary/10" />

            {/* Progress Ring */}
            <svg className="absolute w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] lg:w-[510px] lg:h-[510px] -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="48%"
                fill="none"
                stroke="hsl(var(--primary) / 0.1)"
                strokeWidth="2"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="48%"
                fill="none"
                stroke={activeWatch.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 48}%`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 48}%` }}
                animate={{
                  strokeDashoffset: `${2 * Math.PI * 48 * (1 - (activeIndex + 1) / watches.length)}%`
                }}
                transition={{ duration: 0.5 }}
              />
            </svg>

            {/* Mini Watch Thumbnails */}
            {watches.map((watch, index) => {
              const angle = (index * 360) / watches.length - 90;
              const radius = 220;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              const isActive = index === activeIndex;

              return (
                <motion.button
                  key={watch.id}
                  className="absolute w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center cursor-pointer z-10"
                  style={{
                    left: "50%",
                    top: "50%",
                    x: x - 28,
                    y: y - 28,
                    backgroundColor: isActive ? `${watch.color}20` : 'hsl(var(--card))',
                    border: isActive ? `2px solid ${watch.color}` : '2px solid hsl(var(--border))',
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1);
                    setActiveIndex(index);
                  }}
                  animate={{
                    boxShadow: isActive ? `0 0 20px ${watch.color}40` : 'none',
                  }}
                >
                  <img
                    src={watch.images?.[0] || watch.image}
                    alt={watch.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain"
                  />
                </motion.button>
              );
            })}

            {/* Main Watch Display - 3D Effect in Circle */}
            <motion.div
              className="relative z-20"
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative"
                >
                  {/* Outer Circle Ring */}
                  <div
                    className="absolute inset-0 rounded-full border-4"
                    style={{
                      borderColor: `${activeWatch.color}40`,
                      width: '320px',
                      height: '320px',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />

                  {/* Inner Circle Background */}
                  <motion.div
                    className="w-72 h-72 sm:w-80 sm:h-80 lg:w-[320px] lg:h-[320px] rounded-full flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `radial-gradient(circle, hsl(var(--card)) 0%, ${activeWatch.color}20 50%, ${activeWatch.color}30 100%)`,
                      border: `3px solid ${activeWatch.color}50`,
                      boxShadow: `0 0 80px ${activeWatch.color}40, inset 0 0 60px ${activeWatch.color}15`,
                    }}
                  >
                    {/* Watch Glow Inside Circle */}
                    <motion.div
                      className="absolute inset-0 rounded-full blur-2xl"
                      style={{ backgroundColor: `${activeWatch.color}20` }}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* Shimmer Ring Effect */}
                    <motion.div
                      className="absolute inset-2 rounded-full pointer-events-none"
                      style={{
                        background: `conic-gradient(from 0deg, transparent, ${activeWatch.color}30, transparent)`,
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />


                    {/* Main Watch Image - In Front */}
                    <motion.img
                      src={activeWatch.images?.[0] || activeWatch.image}
                      alt={activeWatch.name}
                      className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 object-contain drop-shadow-2xl relative z-10"
                      animate={{
                        y: [0, -10, 0],
                        scale: [1, 1.02, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />


                  </motion.div>

                  {/* Price Tag */}
                  <motion.div
                    className="absolute -right-4 top-4 sm:-right-8 sm:top-8 px-4 py-2 rounded-xl shadow-lg"
                    style={{
                      backgroundColor: activeWatch.color,
                      color: '#fff',
                    }}
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <span className="font-bold text-lg">{settings.currencySymbol}{activeWatch.price}</span>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Navigation Arrows */}
            <motion.button
              onClick={prevWatch}
              className="absolute left-0 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-card backdrop-blur-md shadow-2xl flex items-center justify-center border-2 border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all z-30"
              whileHover={{ scale: 1.15, x: -4 }}
              whileTap={{ scale: 0.95 }}
              style={{
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px ${activeWatch.color}20`
              }}
            >
              <ChevronLeft className="w-7 h-7" />
            </motion.button>

            <motion.button
              onClick={nextWatch}
              className="absolute right-0 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-card backdrop-blur-md shadow-2xl flex items-center justify-center border-2 border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all z-30"
              whileHover={{ scale: 1.15, x: 4 }}
              whileTap={{ scale: 0.95 }}
              style={{
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px ${activeWatch.color}20`
              }}
            >
              <ChevronRight className="w-7 h-7" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bottom Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20 bg-card/60 backdrop-blur-md px-4 py-3 rounded-full border border-border/50 shadow-xl">
        {watches.map((watch, index) => (
          <motion.button
            key={watch.id}
            onClick={() => {
              setDirection(index > activeIndex ? 1 : -1);
              setActiveIndex(index);
            }}
            className="relative h-2 rounded-full overflow-hidden bg-foreground/20"
            animate={{ width: index === activeIndex ? 48 : 20 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
          >
            {index === activeIndex && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: watch.color,
                  boxShadow: `0 0 12px ${watch.color}80`
                }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5, ease: "linear" }}
                key={`progress-${activeIndex}`}
              />
            )}
          </motion.button>
        ))}
      </div>
    </section>
  );
};
