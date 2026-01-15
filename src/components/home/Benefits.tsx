"use client";

import { motion } from "framer-motion";
import { Shield, Truck, RefreshCcw, Award, Clock, Headphones } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Secure Shopping",
    description: "256-bit SSL encryption for safe transactions",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Complimentary delivery on orders over $150",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description: "30-day hassle-free return policy",
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description: "Authentic timepieces with 2-year warranty",
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "Express shipping available worldwide",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer service team",
  },
];

export const Benefits = () => {
  return (
    <section className="py-16 lg:py-24 bg-transparent">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-bold text-xs tracking-[0.3em] uppercase">
            Why Choose Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6">
            The Timecraft Promise
          </h2>
          <div className="w-24 h-1 bg-primary/30 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-[2rem] bg-card/80 backdrop-blur-xl border-2 border-border/50 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] group-hover:-translate-y-2 transition-all duration-500 shadow-soft">
                <benefit.icon className="w-10 h-10 text-primary group-hover:text-primary-foreground transition-all duration-500" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed px-2">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
