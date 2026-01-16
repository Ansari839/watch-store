"use client";

import { motion } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowLeft, Watch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { settings } = useStore();

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 group">
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            <span className="text-sm font-medium uppercase tracking-[0.2em]">Back to Shop</span>
                        </Link>
                        <h1 className="font-display text-4xl lg:text-5xl font-bold">Your Selection</h1>
                        <p className="text-muted-foreground mt-2">A curated collection of your most desired timepieces.</p>
                    </div>
                </div>

                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {wishlist.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white dark:bg-card rounded-[2.5rem] p-6 shadow-soft hover:shadow-xl transition-all border border-border/50 relative"
                            >
                                <button
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="absolute top-4 right-4 w-10 h-10 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-10"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                <Link href={`/products/${item.id}`} className="block">
                                    <div className="aspect-[4/5] bg-[#F8F9FA] dark:bg-background/20 rounded-[2rem] p-8 flex items-center justify-center mb-6 overflow-hidden">
                                        <motion.img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors">{item.name}</h3>
                                        <p className="text-2xl font-bold text-foreground">{settings.currencySymbol}{item.price.toLocaleString()}</p>
                                    </div>
                                </Link>

                                <div className="mt-6 pt-6 border-t border-border/50 flex gap-3">
                                    <Button
                                        onClick={() => addToCart({ ...item as any, quantity: 1, variant: "" })}
                                        className="flex-1 rounded-2xl h-14 font-bold gap-2 group"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        Add to Bag
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-8">
                            <Heart className="w-10 h-10 text-muted-foreground/30" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Your selections are empty</h2>
                        <p className="text-muted-foreground max-w-sm mb-10">Start exploring our exceptional timepieces and save your favorites here.</p>
                        <Button asChild className="rounded-2xl h-14 px-10 font-bold text-lg">
                            <Link href="/products">Explore Collections</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
