"use client";

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
                className="group relative block rounded-[2.5rem] overflow-hidden bg-card/60 backdrop-blur-xl border border-border/50 shadow-soft hover:shadow-premium transition-all duration-500 hover:-translate-y-2"
              >
                {/* Textures */}
                <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
                <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative p-10 flex flex-col min-h-[354px] lg:min-h-[420px]">
                  {/* Text */}
                  <div className="flex-1 relative z-10">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/70 mb-2 block">
                      {category.count} Products
                    </span>
                    <h3 className="font-display text-3xl font-bold text-foreground mb-4">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed max-w-[200px]">
                      {category.description}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-primary font-bold mt-6 group-hover:gap-4 transition-all">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>

                  {/* Image */}
                  <div className="absolute right-[-10%] bottom-[-5%] w-48 h-48 lg:w-64 lg:h-64 pointer-events-none transition-transform duration-700 group-hover:scale-105">
                    <motion.img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-contain filter drop-shadow-2xl brightness-[1.02] rotate-[-5deg] group-hover:rotate-[0deg] transition-all duration-700"
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
