"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Heart,
  User,
  LogOut,
  ChevronDown,
  Settings,
  Package,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/products" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const { cart, total, itemCount, removeFromCart, updateQuantity } = useCart();
  const { settings } = useStore();
  const { data: session, status } = useSession();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -ml-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">T</span>
              </div>
              <span className="font-display text-xl lg:text-2xl font-semibold text-foreground">
                Timecraft
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="relative py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link.name}
                  {pathname === link.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 transition-colors ${isSearchOpen ? 'text-primary' : 'text-foreground/70 hover:text-foreground'}`}
              >
                <Search className="w-5 h-5" />
              </button>
              {/* Account & Bag */}
              <div className="flex items-center gap-1 md:gap-2">
                <div className="relative group">
                  {status === "authenticated" ? (
                    <div className="relative">
                      <button
                        onClick={() => setIsAccountOpen(!isAccountOpen)}
                        className="p-2 md:p-3 hover:bg-muted/50 rounded-full transition-all flex items-center gap-2"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {session.user?.name?.charAt(0)}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isAccountOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isAccountOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-56 bg-white dark:bg-card rounded-2xl shadow-xl border border-border/50 py-2 z-50 overflow-hidden"
                          >
                            <div className="px-4 py-3 border-b border-border/50">
                              <p className="text-sm font-bold truncate">{session.user?.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                            </div>

                            <div className="p-1">
                              <Link
                                href="/dashboard"
                                onClick={() => setIsAccountOpen(false)}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-muted/50 rounded-xl transition-colors"
                              >
                                <User className="w-4 h-4" />
                                Profile
                              </Link>
                              <Link
                                href="/orders"
                                onClick={() => setIsAccountOpen(false)}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-muted/50 rounded-xl transition-colors"
                              >
                                <Package className="w-4 h-4" />
                                My Orders
                              </Link>
                              {(session.user as any)?.role === "ADMIN" && (
                                <Link
                                  href="/admin"
                                  onClick={() => setIsAccountOpen(false)}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-muted/50 rounded-xl transition-colors text-primary"
                                >
                                  <Settings className="w-4 h-4" />
                                  Admin Panel
                                </Link>
                              )}
                            </div>

                            <div className="p-1 border-t border-border/50">
                              <button
                                onClick={() => {
                                  signOut();
                                  setIsAccountOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/5 rounded-xl transition-colors"
                              >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link href="/login">
                      <Button variant="ghost" size="icon" className="hidden md:flex rounded-full hover:bg-muted/50">
                        <User className="w-5 h-5" />
                      </Button>
                    </Link>
                  )}
                </div>

                <Link href="/wishlist">
                  <Button variant="ghost" size="icon" className="hidden md:flex rounded-full hover:bg-muted/50">
                    <Heart className="w-5 h-5" />
                  </Button>
                </Link>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-foreground/70 hover:text-foreground transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-border overflow-hidden"
              >
                <div className="container mx-auto px-4 py-4">
                  <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search for watches..."
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }
                      }}
                      className="w-full pl-12 pr-4 py-3 bg-muted rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-white dark:bg-card shadow-2xl flex flex-col"
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-2xl font-bold">Your Bag</h2>
                  <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-bold rounded-full">{itemCount} items</span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <div key={`${item.id}-${item.variant}`} className="flex gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-muted overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-sm">{item.name}</h3>
                            {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex justify-between items-center">
                          <div className="flex items-center gap-3 bg-muted rounded-xl px-2 py-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:text-primary transition-colors disabled:opacity-30"
                              disabled={item.quantity <= 1}
                            >
                              <X className="w-3 h-3 rotate-45 transform" />
                            </button>
                            <span className="text-xs font-bold min-w-[1rem] text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-primary transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="font-display text-sm font-bold">{settings.currencySymbol}{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                      <ShoppingBag className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Bag is empty</h3>
                      <p className="text-sm text-muted-foreground">Your luxury pursuit starts here.</p>
                    </div>
                    <Button onClick={() => setIsCartOpen(false)} className="rounded-2xl px-8 h-12">Shop Now</Button>
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-border/50 bg-[#F8F9FA] dark:bg-background/20 space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Subtotal</span>
                    <span className="text-2xl font-display font-bold">{settings.currencySymbol}{total.toLocaleString()}</span>
                  </div>
                  <Button
                    onClick={() => setIsCartOpen(false)}
                    asChild
                    className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
                  >
                    <Link href="/checkout">Checkout Now</Link>
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16 lg:h-20" />
    </>
  );
};
