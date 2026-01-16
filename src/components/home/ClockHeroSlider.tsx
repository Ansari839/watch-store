"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Star, ShoppingBag, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
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
  const [currentTime, setCurrentTime] = useState(new Date());
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

  // Update time every second for clock hands
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate rotation angles for clock hands
  const seconds = currentTime.getSeconds();
  const minutes = currentTime.getMinutes();
  const hours = currentTime.getHours() % 12;

  const secondRotation = seconds * 6; // 360 / 60 = 6 degrees per second
  const minuteRotation = minutes * 6 + seconds * 0.1; // 6 degrees per minute + smooth transition
  const hourRotation = hours * 30 + minutes * 0.5; // 30 degrees per hour + smooth transition

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
      x: dir > 0 ? 400 : -400,
      opacity: 0,
      scale: 0.5,
      rotateY: dir > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      } as any
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -400 : 400,
      opacity: 0,
      scale: 0.5,
      rotateY: dir > 0 ? -45 : 45,
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
            <div className="space-y-2">
              <motion.h1
                className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Timeless
              </motion.h1>
              <motion.h1
                className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${activeWatch.color}, hsl(var(--primary)))`
                  }}
                >
                  Elegance
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

            {/* Active Watch Details */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col sm:flex-row items-center lg:items-start gap-4 py-4"
              >
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-foreground">{activeWatch.name}</h3>
                  <div className="flex items-center gap-2 mt-1 justify-center lg:justify-start">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(activeWatch.rating) ? 'fill-gold text-gold' : 'text-muted-foreground/30'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({activeWatch.rating})</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold" style={{ color: activeWatch.color }}>
                    ${activeWatch.price}
                  </span>
                  {activeWatch.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${activeWatch.originalPrice}
                    </span>
                  )}
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
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                2 Year Warranty
              </div>
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

                    {/* Clock Hands - Extending Beyond Circle, Visible Outside */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 5 }}>
                      {/* Hour Hand - Extends well beyond circle */}
                      <motion.div
                        className="absolute w-3 sm:w-4 origin-bottom rounded-full"
                        style={{
                          height: '200px',
                          background: `linear-gradient(to top, ${activeWatch.color}, ${activeWatch.color}60)`,
                          bottom: '50%',
                          boxShadow: `0 0 20px ${activeWatch.color}80, 0 0 40px ${activeWatch.color}40`,
                        }}
                        animate={{ rotate: hourRotation }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                      />

                      {/* Minute Hand - Extends well beyond circle */}
                      <motion.div
                        className="absolute w-2.5 sm:w-3 origin-bottom rounded-full"
                        style={{
                          height: '240px',
                          background: `linear-gradient(to top, hsl(var(--foreground)), hsl(var(--foreground) / 0.5))`,
                          bottom: '50%',
                          boxShadow: '0 0 15px hsl(var(--foreground) / 0.5)',
                        }}
                        animate={{ rotate: minuteRotation }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                      />

                      {/* Second Hand - Extends well beyond circle */}
                      <motion.div
                        className="absolute w-1.5 sm:w-2 origin-bottom rounded-full"
                        style={{
                          height: '260px',
                          background: 'linear-gradient(to top, #ef4444, #ef444450)',
                          bottom: '50%',
                          boxShadow: '0 0 15px #ef444480',
                        }}
                        animate={{ rotate: secondRotation }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />

                      {/* Second Hand Tail */}
                      <motion.div
                        className="absolute w-1.5 sm:w-2 origin-top rounded-full"
                        style={{
                          height: '50px',
                          background: '#ef4444',
                          top: '50%',
                          boxShadow: '0 0 10px #ef444460',
                        }}
                        animate={{ rotate: secondRotation }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />

                      {/* Center Dot */}
                      <motion.div
                        className="absolute w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                        style={{
                          backgroundColor: activeWatch.color,
                          boxShadow: `0 0 20px ${activeWatch.color}`,
                          zIndex: 10,
                        }}
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>

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
                    <span className="font-bold text-lg">${activeWatch.price}</span>
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
