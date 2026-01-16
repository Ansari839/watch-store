"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Layout,
    Image as ImageIcon,
    ShoppingBag,
    Save,
    Plus,
    Trash2,
    Info,
    Mail,
    Phone,
    MapPin,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LandingPageManagement() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>({
        heroProductIds: [],
        featuredIds: [],
        categoryImages: {},
        footerEmail: "",
        footerPhone: "",
        footerAddress: "",
        footerSocials: {}
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [productsRes, settingsRes] = await Promise.all([
                fetch("/api/products"),
                fetch("/api/admin/landing")
            ]);

            const products = await productsRes.json();
            const cmsSettings = await settingsRes.json();

            if (Array.isArray(products)) setAllProducts(products);
            if (cmsSettings && !cmsSettings.error) setSettings(cmsSettings);
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/landing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                toast.success("Landing page updated successfully");
            } else {
                toast.error("Failed to save changes");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    const toggleHeroProduct = (id: string) => {
        setSettings(prev => ({
            ...prev,
            heroProductIds: prev.heroProductIds.includes(id)
                ? prev.heroProductIds.filter((pid: string) => pid !== id)
                : [...prev.heroProductIds, id]
        }));
    };

    const toggleFeaturedProduct = (id: string) => {
        setSettings(prev => ({
            ...prev,
            featuredIds: prev.featuredIds.includes(id)
                ? prev.featuredIds.filter((pid: string) => pid !== id)
                : [...prev.featuredIds, id]
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground tracking-tight">Landing Page CMS</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Manage your store's front-facing content dynamically.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-2xl h-14 px-8 bg-primary font-bold shadow-lg shadow-primary/20 gap-2 min-w-[160px]"
                >
                    {saving ? "Saving..." : <><Save className="w-5 h-5" /> Save Changes</>}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Hero Slider Management */}
                <section className="bg-white dark:bg-card p-8 rounded-[2.5rem] border border-border/50 shadow-soft">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Layout className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Hero Slider</h2>
                            <p className="text-sm text-muted-foreground">Select products to feature in the main slider.</p>
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {allProducts.map(product => (
                            <div
                                key={product.id}
                                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${settings.heroProductIds.includes(product.id)
                                    ? "border-primary bg-primary/5"
                                    : "border-border/50 hover:border-primary/20"
                                    }`}
                                onClick={() => toggleHeroProduct(product.id)}
                            >
                                <div className="w-16 h-16 rounded-xl bg-muted p-1 flex items-center justify-center">
                                    <img src={product.images[0]} alt="" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">{product.name}</h4>
                                    <p className="text-xs text-muted-foreground">${product.price}</p>
                                </div>
                                {settings.heroProductIds.includes(product.id) && (
                                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                                        <Check className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Featured Products Management */}
                <section className="bg-white dark:bg-card p-8 rounded-[2.5rem] border border-border/50 shadow-soft">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Featured Products</h2>
                            <p className="text-sm text-muted-foreground">Hand-pick products for the featured section.</p>
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {allProducts.map(product => (
                            <div
                                key={product.id}
                                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${settings.featuredIds.includes(product.id)
                                    ? "border-accent bg-accent/5"
                                    : "border-border/50 hover:border-accent/20"
                                    }`}
                                onClick={() => toggleFeaturedProduct(product.id)}
                            >
                                <div className="w-16 h-16 rounded-xl bg-muted p-1 flex items-center justify-center">
                                    <img src={product.images[0]} alt="" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">{product.name}</h4>
                                    <p className="text-xs text-muted-foreground">${product.price}</p>
                                </div>
                                {settings.featuredIds.includes(product.id) && (
                                    <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center">
                                        <Check className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Category Images Management */}
                <section className="lg:col-span-2 bg-white dark:bg-card p-8 rounded-[2.5rem] border border-border/50 shadow-soft">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Category Thumbnails</h2>
                            <p className="text-sm text-muted-foreground">Manage thumbnail images for product categories.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {['men', 'women', 'smart'].map((catId) => (
                            <div key={catId} className="space-y-4">
                                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground block">
                                    {catId === 'men' ? "Men's Collection" : catId === 'women' ? "Women's Collection" : "Smart Watches"}
                                </label>
                                <div className="aspect-square rounded-3xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative group">
                                    {(settings.categoryImages?.[catId]) ? (
                                        <>
                                            <img src={settings.categoryImages[catId]} alt="" className="w-full h-full object-contain p-4" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="rounded-full"
                                                    onClick={() => setSettings({
                                                        ...settings,
                                                        categoryImages: { ...settings.categoryImages, [catId]: "" }
                                                    })}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={settings.categoryImages?.[catId] || ""}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        categoryImages: { ...settings.categoryImages, [catId]: e.target.value }
                                    })}
                                    placeholder="Thumbnail Image URL"
                                    className="w-full p-4 bg-muted/20 border-border/50 border rounded-2xl outline-none focus:ring-2 ring-primary/20 text-xs"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer Management */}
                <section className="lg:col-span-2 bg-white dark:bg-card p-8 rounded-[2.5rem] border border-border/50 shadow-soft">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                            <Info className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Footer & Contact Information</h2>
                            <p className="text-sm text-muted-foreground">Manage your store's contact details and footer text.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary" /> Email Address
                            </label>
                            <input
                                type="email"
                                value={settings.footerEmail || ""}
                                onChange={(e) => setSettings({ ...settings, footerEmail: e.target.value })}
                                className="w-full p-4 bg-muted/20 border-border/50 border rounded-2xl outline-none focus:ring-2 ring-primary/20"
                                placeholder="contact@timecraft.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" /> Phone Number
                            </label>
                            <input
                                type="text"
                                value={settings.footerPhone || ""}
                                onChange={(e) => setSettings({ ...settings, footerPhone: e.target.value })}
                                className="w-full p-4 bg-muted/20 border-border/50 border rounded-2xl outline-none focus:ring-2 ring-primary/20"
                                placeholder="+1 (234) 567-890"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" /> Physical Address
                            </label>
                            <textarea
                                value={settings.footerAddress || ""}
                                onChange={(e) => setSettings({ ...settings, footerAddress: e.target.value })}
                                className="w-full p-4 bg-muted/20 border-border/50 border rounded-2xl outline-none focus:ring-2 ring-primary/20 min-h-[100px]"
                                placeholder="123 Luxury Lane, Geneva, Switzerland"
                            />
                        </div>

                        {/* Social Links */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border/50">
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Facebook URL</label>
                                <input
                                    type="text"
                                    value={settings.footerSocials?.facebook || ""}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        footerSocials: { ...settings.footerSocials, facebook: e.target.value }
                                    })}
                                    className="w-full p-4 bg-muted/20 border-border/50 border rounded-2xl outline-none focus:ring-2 ring-primary/20 text-xs"
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Instagram URL</label>
                                <input
                                    type="text"
                                    value={settings.footerSocials?.instagram || ""}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        footerSocials: { ...settings.footerSocials, instagram: e.target.value }
                                    })}
                                    className="w-full p-4 bg-muted/20 border-border/50 border rounded-2xl outline-none focus:ring-2 ring-primary/20 text-xs"
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Twitter URL</label>
                                <input
                                    type="text"
                                    value={settings.footerSocials?.twitter || ""}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        footerSocials: { ...settings.footerSocials, twitter: e.target.value }
                                    })}
                                    className="w-full p-4 bg-muted/20 border-border/50 border rounded-2xl outline-none focus:ring-2 ring-primary/20 text-xs"
                                    placeholder="https://twitter.com/..."
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
