"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import {
    CreditCard,
    Truck,
    ShieldCheck,
    MessageCircle,
    ChevronRight,
    MapPin,
    User,
    Phone,
    Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { toast } from "sonner";

export default function CheckoutPage() {
    const { cart, total, clearCart } = useCart();
    const { settings } = useStore();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        shippingAddress: "",
        whatsappEnabled: true,
        paymentMethod: "stripe" // Default
    });

    const [shippingFee, setShippingFee] = useState(0);

    const handleApplyCoupon = () => {
        setIsApplyingCoupon(true);
        setTimeout(() => {
            if (couponCode.toUpperCase() === "LUXE10") {
                setDiscount(total * 0.1);
                toast.success("10% Discount Applied!");
            } else if (couponCode.toUpperCase() === "TIMELESS") {
                setDiscount(50);
                toast.success(`${settings.currencySymbol}50 Discount Applied!`);
            } else {
                toast.error("Invalid coupon code.");
            }
            setIsApplyingCoupon(false);
        }, 800);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as any;
        const val = type === "checkbox" ? (e.target as any).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));

        // Quick Shipping Calculator Mock
        if (name === "shippingAddress") {
            if (value.length > 5 && value.length < 20) setShippingFee(15);
            else if (value.length >= 20) setShippingFee(25);
            else setShippingFee(0);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;

        setIsSubmitting(true);
        try {
            if (formData.paymentMethod === "stripe") {
                const stripeRes = await fetch("/api/checkout/stripe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        items: cart,
                        customerEmail: formData.customerEmail,
                        customerName: formData.customerName,
                        shippingAddress: formData.shippingAddress,
                        customerPhone: formData.customerPhone,
                        whatsappEnabled: formData.whatsappEnabled
                    })
                });
                const { url } = await stripeRes.json();
                if (url) {
                    window.location.href = url;
                    return;
                }
            }

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    items: cart,
                    total
                })
            });

            if (res.ok) {
                toast.success(formData.paymentMethod === "cod" ? "Order placed! (COD)" : "Order placed successfully!");
                clearCart();
                router.push("/dashboard");
            } else {
                toast.error("Failed to place order.");
            }
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="font-display text-4xl font-bold mb-4">Your Bag is Empty</h1>
                <p className="text-muted-foreground mb-8">Add some luxury to your bag before checking out.</p>
                <Button onClick={() => router.push("/products")} className="rounded-2xl h-14 px-10">Return to Shop</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-background py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">Finalize Order</h1>
                    <p className="text-muted-foreground mb-12 text-lg">Secure your time-capsule with our encrypted checkout.</p>

                    <div className="grid lg:grid-cols-5 gap-12">
                        {/* Checkout Form */}
                        <div className="lg:col-span-3 space-y-8">
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
                                {/* Shipping Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-10 bg-white dark:bg-card rounded-[2.5rem] shadow-soft border border-border/50 space-y-8"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold font-display">Personal Details</h2>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-sm font-bold text-muted-foreground px-1 uppercase tracking-wider">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                name="customerName"
                                                value={formData.customerName}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Abdullah Ansari"
                                                className="w-full p-4 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl focus:ring-2 ring-primary/20 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-sm font-bold text-muted-foreground px-1 uppercase tracking-wider">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                name="customerEmail"
                                                value={formData.customerEmail}
                                                onChange={handleInputChange}
                                                placeholder="e.g. user@example.com"
                                                className="w-full p-4 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl focus:ring-2 ring-primary/20 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        <label className="text-sm font-bold text-muted-foreground px-1 uppercase tracking-wider">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <input
                                                required
                                                type="tel"
                                                name="customerPhone"
                                                value={formData.customerPhone}
                                                onChange={handleInputChange}
                                                placeholder="+1 (555) 000-0000"
                                                className="w-full pl-12 p-4 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl focus:ring-2 ring-primary/20 outline-none"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="p-10 bg-white dark:bg-card rounded-[2.5rem] shadow-soft border border-border/50 space-y-8"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold font-display">Shipping Information</h2>
                                    </div>

                                    <div className="space-y-2.5">
                                        <label className="text-sm font-bold text-muted-foreground px-1 uppercase tracking-wider">Shipping Address</label>
                                        <textarea
                                            required
                                            name="shippingAddress"
                                            value={formData.shippingAddress}
                                            onChange={handleInputChange}
                                            rows={4}
                                            placeholder="Street address, apartment, city, state, zip"
                                            className="w-full p-4 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl focus:ring-2 ring-primary/20 outline-none resize-none"
                                        />
                                    </div>

                                    <div className="flex items-center gap-4 p-6 bg-green-500/5 rounded-3xl border border-green-500/20">
                                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                                            <MessageCircle className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm">WhatsApp Updates</h4>
                                            <p className="text-xs text-muted-foreground">Receive real-time tracking via WhatsApp.</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            name="whatsappEnabled"
                                            checked={formData.whatsappEnabled}
                                            onChange={handleInputChange}
                                            className="w-6 h-6 accent-primary"
                                        />
                                    </div>
                                </motion.div>

                                {/* Payment Method Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="p-10 bg-white dark:bg-card rounded-[2.5rem] shadow-soft border border-border/50 space-y-8"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold font-display">Payment Method</h2>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        {[
                                            { id: "stripe", name: "Credit Card", icon: "💳", desc: "Secure via Stripe" },
                                            { id: "paypal", name: "PayPal", icon: "🅿️", desc: "Safe & Fast" },
                                            { id: "cod", name: "COD", icon: "🚚", desc: "Cash on Delivery" },
                                        ].map((method) => (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                                                className={`p-6 rounded-3xl border-2 transition-all text-left flex flex-col gap-2 ${formData.paymentMethod === method.id
                                                    ? "border-primary bg-primary/5 shadow-inner"
                                                    : "border-border/50 hover:border-primary/30"
                                                    }`}
                                            >
                                                <span className="text-2xl">{method.icon}</span>
                                                <div className="font-bold text-sm tracking-tight">{method.name}</div>
                                                <div className="text-[10px] text-muted-foreground uppercase font-bold">{method.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-2">
                            <div className="sticky top-32 space-y-8">
                                <section className="p-8 bg-white dark:bg-card rounded-[2.5rem] shadow-soft border border-border/50">
                                    <h3 className="text-xl font-bold font-display mb-6">Order Summary</h3>
                                    <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        {cart.map((item) => (
                                            <div key={`${item.id}-${item.variant}`} className="flex justify-between gap-4">
                                                <div className="flex gap-3">
                                                    <span className="font-bold text-muted-foreground">x{item.quantity}</span>
                                                    <span className="font-medium text-sm line-clamp-1">{item.name}</span>
                                                </div>
                                                <span className="font-bold">{settings.currencySymbol}{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4 mb-8 pt-6 border-t border-border/50">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Coupon Code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                className="flex-1 px-4 py-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                            <Button
                                                type="button"
                                                onClick={handleApplyCoupon}
                                                disabled={isApplyingCoupon || !couponCode}
                                                variant="outline"
                                                className="rounded-xl px-6"
                                            >
                                                {isApplyingCoupon ? "..." : "Apply"}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-border/50">
                                        <div className="flex justify-between text-muted-foreground text-sm font-medium">
                                            <span>Subtotal</span>
                                            <span>{settings.currencySymbol}{total.toLocaleString()}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex justify-between text-emerald-500 text-sm font-bold">
                                                <span>Discount</span>
                                                <span>-{settings.currencySymbol}{discount.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-muted-foreground text-sm font-medium">
                                            <span>Shipping</span>
                                            <span className={shippingFee === 0 ? "text-green-500 font-bold" : "text-foreground font-bold"}>
                                                {shippingFee === 0 ? "FREE" : `${settings.currencySymbol}${shippingFee.toLocaleString()}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end pt-4">
                                            <span className="font-display font-medium text-lg uppercase tracking-widest text-muted-foreground">Total</span>
                                            <span className="text-3xl font-display font-bold">{settings.currencySymbol}{(total - discount + shippingFee).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        form="checkout-form"
                                        disabled={isSubmitting}
                                        className="w-full h-16 rounded-2xl mt-8 text-lg font-bold shadow-lg shadow-primary/20 gap-3"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <CreditCard className="w-6 h-6" />
                                                Place Order
                                            </>
                                        )}
                                    </Button>
                                </section>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-muted/50 rounded-2xl flex flex-col items-center text-center">
                                        <ShieldCheck className="w-5 h-5 text-primary mb-2" />
                                        <span className="text-[10px] uppercase font-bold tracking-tighter">Secure Payment</span>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-2xl flex flex-col items-center text-center">
                                        <Truck className="w-5 h-5 text-primary mb-2" />
                                        <span className="text-[10px] uppercase font-bold tracking-tighter">Express Delivery</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
