"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const watch1 = "/assets/watches/watch-1.png";
const watch2 = "/assets/watches/watch-2.png";
const watch3 = "/assets/watches/watch-3.png";

const categories = [
  {
    id: "men",
    title: "Men's Collection",
    description: "Bold designs for the modern gentleman",
    image: watch1,
    count: 48,
    gradient: "from-primary to-secondary",
  },
  {
    id: "women",
    title: "Women's Collection",
    description: "Elegant timepieces for every occasion",
    image: watch2,
    count: 36,
    gradient: "from-accent to-gold",
  },
  {
    id: "smart",
    title: "Smart Watches",
    description: "Technology meets timeless style",
    image: watch3,
    count: 24,
    gradient: "from-secondary to-primary",
  },
];

export const Categories = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/landing");
        const data = await res.json();
        if (data && !data.error) setSettings(data);
      } catch (err) {
        console.error("Categories settings fetch error:", err);
      }
    };
    fetchSettings();
  }, []);

  const getCategoryImage = (catId: string, defaultImage: string) => {
    return settings?.categoryImages?.[catId] || defaultImage;
  };

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
          <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase">
            Browse by Category
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Find Your Perfect Watch
          </h2>
          <div className="w-20 h-1 bg-primary/20 mx-auto rounded-full" />
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/products?category=${category.id}`}
                className="group relative block rounded-[3rem] overflow-hidden bg-card/80 backdrop-blur-2xl border-2 border-border/80 hover:border-primary/40 shadow-premium transition-all duration-700 hover:-translate-y-4"
              >
                {/* Textures */}
                <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />
                <div className={`absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <div className="absolute -right-20 -top-20 w-48 h-48 bg-primary/20 rounded-full blur-[100px]" />

                {/* Content */}
                <div className="relative p-12 flex flex-col min-h-[380px] lg:min-h-[450px]">
                  {/* Text */}
                  <div className="flex-1 relative z-10">
                    <span className="text-[11px] font-extrabold tracking-[0.3em] uppercase text-primary mb-3 block">
                      {category.count} Products
                    </span>
                    <h3 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed max-w-[240px] text-lg">
                      {category.description}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-3 text-primary font-extrabold mt-8 group-hover:gap-5 transition-all text-lg">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-6 h-6 stroke-[3px]" />
                  </div>

                  {/* Image */}
                  <div className="absolute right-[-15%] bottom-[-10%] w-56 h-56 lg:w-72 lg:h-72 pointer-events-none transition-transform duration-1000 group-hover:scale-110 group-hover:-rotate-6">
                    <motion.img
                      src={getCategoryImage(category.id, category.image)}
                      alt={category.title}
                      className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] brightness-[1.1] rotate-[-8deg] group-hover:rotate-[0deg] transition-all duration-1000"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
