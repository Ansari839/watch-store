"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Percent } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const watch4 = "/assets/watches/watch-4.png";
const watch5 = "/assets/watches/watch-5.png";

export const PromoSection = () => {
  const { settings } = useStore();
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Promo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[2.5rem] bg-primary p-8 lg:p-14 text-white overflow-hidden min-h-[450px] flex flex-col justify-between shadow-2xl"
          >
            {/* Background Texture/Grid */}
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="absolute -right-20 -top-20 w-[400px] h-[400px] rounded-full bg-white/10 blur-[100px]" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-8 border border-white/20">
                <Percent className="w-4 h-4" />
                Limited Time Offer
              </span>
              <h3 className="font-display text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Season Sale<br />Up to 40% Off
              </h3>
              <p className="text-white/80 text-lg max-w-sm mb-10 leading-relaxed">
                Experience luxury for less. Our exclusive seasonal timepiece collection is now available at exceptional prices.
              </p>
              <Button asChild variant="secondary" size="lg" className="h-14 px-10 rounded-2xl bg-white text-primary hover:bg-white/90 shadow-xl group border-none">
                <Link href="/products" className="flex items-center gap-3 font-bold">
                  Shop the Sale
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* Watch Image */}
            <motion.img
              src={watch4}
              alt="Sale Watch"
              className="absolute right-4 bottom-4 w-48 h-48 lg:w-64 lg:h-64 object-contain drop-shadow-2xl"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Side Promos */}
          <div className="flex flex-col gap-8">
            {/* New Arrivals */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group"
            >
              <Link
                href="/products?sort=new"
                className="relative block rounded-[2.5rem] bg-white dark:bg-card p-8 lg:p-10 overflow-hidden shadow-soft transition-all duration-500 hover:shadow-premium group h-[211px]"
              >
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-2">Just Arrived</span>
                  <h3 className="font-display text-3xl font-bold text-foreground mb-4">
                    New Collection
                  </h3>
                  <span className="inline-flex items-center gap-2 text-primary font-bold transition-all group-hover:gap-4">
                    Discover Now <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-grid opacity-20 pointer-events-none" />
                <motion.img
                  src={watch5}
                  alt="New Collection"
                  className="absolute -right-8 -bottom-8 w-48 h-48 lg:w-56 lg:h-56 object-contain rotate-[-15deg] group-hover:rotate-[0deg] transition-all duration-700 pointer-events-none"
                />
              </Link>
            </motion.div>

            {/* Free Shipping Highlight */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative rounded-[2.5rem] bg-accent p-8 lg:p-10 text-white overflow-hidden shadow-xl h-[211px] flex items-center"
            >
              <div className="absolute inset-0 bg-grid opacity-10" />
              <div className="relative z-10 flex gap-6 items-center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/80 mb-1 block">Global Logistics</span>
                  <h3 className="font-display text-2xl lg:text-3xl font-bold mb-2">Free Express Shipping</h3>
                  <p className="text-white/80 text-sm max-w-xs leading-relaxed">
                    Complimentary worldwide delivery on all orders over {settings.currencySymbol}150. Your luxury timepiece, delivered with care.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
