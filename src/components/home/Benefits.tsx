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
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2">
            The Timecraft Promise
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4 group-hover:bg-primary group-hover:shadow-glow transition-all duration-300">
                <benefit.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-medium text-foreground mb-1">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
