"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Save,
    X,
    Layout,
    Search as SeoIcon,
    Layers,
    Image as ImageIcon,
    Tag,
    Plus,
    Trash2,
    Upload,
    ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";

const tabs = [
    { id: "general", label: "General Info", icon: Layout },
    { id: "seo", label: "SEO Settings", icon: SeoIcon },
    { id: "variants", label: "Variants & Stock", icon: Layers },
    { id: "images", label: "Gallery", icon: ImageIcon },
];

export default function AddProductPage() {
    const [activeTab, setActiveTab] = useState("general");
    const { settings } = useStore();
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        originalPrice: "",
        badge: "",
        description: "",
        category: "Men's Luxury",
        stockStatus: "In Stock",
        metaTitle: "",
        metaDescription: "",
        keywords: ""
    });
    const [images, setImages] = useState<string[]>([]);
    const [variants, setVariants] = useState<{ name: string, price: string, stock: string }[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    console.error("Expected array but received:", data);
                    setCategories([]);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addVariant = () => {
        setVariants([...variants, { name: "", price: "", stock: "" }]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index: number, field: string, value: string) => {
        const newVariants = [...variants];
        (newVariants[index] as any)[field] = value;
        setVariants(newVariants);
    };

    const handleSave = async () => {
        try {
            const res = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    images: images.length > 0 ? images : ["/assets/watches/watch-1.png"], // Placeholder
                    variants,
                    price: parseFloat(formData.price) || 0,
                    originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
                    categoryId: categories.find(c => c.name === formData.category)?.id || categories[0]?.id
                })
            });
            if (res.ok) {
                alert("Product saved successfully!");
            } else {
                alert("Failed to save product.");
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground tracking-tight">Add New Product</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Create a new luxury timepiece entry with full SEO and variant control.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl h-12 px-6 border-border font-bold">Discard</Button>
                    <Button
                        onClick={handleSave}
                        className="rounded-2xl h-12 px-8 bg-primary font-bold shadow-lg shadow-primary/20 gap-2"
                    >
                        <Save className="w-5 h-5" />
                        Save Product
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Fixed Tabs Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-32 space-y-2 p-2 bg-white dark:bg-card rounded-[2.5rem] shadow-soft border border-border/50">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold ${activeTab === tab.id
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:bg-[#F8F9FA] dark:hover:bg-background/20"
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Form Area */}
                <div className="lg:col-span-3 space-y-8">
                    <AnimatePresence mode="wait">
                        {activeTab === "general" && (
                            <motion.div
                                key="general"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-10 bg-white dark:bg-card rounded-[2.5rem] shadow-soft border border-border/50 space-y-8"
                            >
                                <h2 className="text-2xl font-bold font-display px-2">Basic Information</h2>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2.5">
                                        <label className="text-sm font-bold text-muted-foreground px-1 uppercase tracking-wider">Product Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Royal Oak Offshore"
                                            className="w-full p-4 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl text-base ring-offset-background focus:ring-2 ring-primary/20 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-sm font-bold text-muted-foreground px-1 uppercase tracking-wider">Sale Price ({settings.currencySymbol})</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="Current selling price"
                                            className="w-full p-4 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl text-base ring-offset-background focus:ring-2 ring-primary/20 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-sm font-bold text-muted-foreground px-1 uppercase tracking-wider">Display Price ({settings.currencySymbol})</label>
                                        <input
                                            type="number"
                                            name="originalPrice"
                                            value={formData.originalPrice}
                                            onChange={handleInputChange}
                                            placeholder="Price before discount (optional)"
                                            className="w-full p-4 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl text-base ring-offset-background focus:ring-2 ring-primary/20 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-sm font-bold text-muted-foreground px-1 uppercase tracking-wider">Product Tag (Badge)</label>
                                    <input
                                        type="text"
                                        name="badge"
                                        value={formData.badge}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Bestseller, Limited Edition, New Arrival"
                                        className="w-full p-4 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl text-base ring-offset-background focus:ring-2 ring-primary/20 transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-sm font-bold text-muted-foreground px-1 uppercase tracking-wider">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder="Enter a compelling luxury product description..."
                                        className="w-full p-4 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl text-base ring-offset-background focus:ring-2 ring-primary/20 transition-all outline-none resize-none"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2.5">
                                        <label className="text-sm font-bold text-muted-foreground px-1 uppercase tracking-wider">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full p-4 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl text-base ring-offset-background focus:ring-2 ring-primary/20 transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id}>{cat.name}</option>
                                            ))}
                                            {categories.length === 0 && <option>Loading...</option>}
                                        </select>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-sm font-bold text-muted-foreground px-1 uppercase tracking-wider">Stock Status</label>
                                        <select
                                            name="stockStatus"
                                            value={formData.stockStatus}
                                            onChange={handleInputChange}
                                            className="w-full p-4 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl text-base ring-offset-background focus:ring-2 ring-primary/20 transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option>In Stock</option>
                                            <option>Pre-order</option>
                                            <option>Out of Stock</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "seo" && (
                            <motion.div
                                key="seo"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-10 bg-white dark:bg-card rounded-[2.5rem] shadow-soft border border-border/50 space-y-8"
                            >
                                <div className="flex items-center gap-4 mb-2">
                                    <h2 className="text-2xl font-bold font-display px-2">Search Engine Optimization</h2>
                                    <div className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full border border-green-500/20 uppercase tracking-tighter italic">Recommended</div>
                                </div>

                                <div className="p-6 bg-[#F8F9FA] dark:bg-background rounded-3xl border border-dashed border-border/50 space-y-2">
                                    <span className="text-xs font-bold text-green-600 uppercase">Google Preview</span>
                                    <h3 className="text-xl font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{formData.metaTitle || (formData.name ? `${formData.name} | Timecraft` : "Product Name | Timecraft")}</h3>
                                    <p className="text-sm text-green-700 dark:text-green-500">timecraft.com › products › {formData.name.toLowerCase().replace(/ /g, '-') || "url-slug"}</p>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{formData.metaDescription || "This is where your meta description will appear. Make it catchy and informative..."}</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2.5">
                                        <label className="text-sm font-bold text-muted-foreground px-1 uppercase tracking-wider">Meta Title</label>
                                        <input
                                            type="text"
                                            name="metaTitle"
                                            value={formData.metaTitle}
                                            onChange={handleInputChange}
                                            className="w-full p-4 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl focus:ring-2 ring-primary/20 outline-none"
                                        />
                                        <div className="flex justify-between px-1">
                                            <span className={`text-[10px] uppercase font-bold ${formData.metaTitle.length > 60 ? 'text-red-500' : 'text-muted-foreground'}`}>Characters: {formData.metaTitle.length}/60</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-sm font-bold text-muted-foreground px-1 uppercase tracking-wider">Meta Description</label>
                                        <textarea
                                            name="metaDescription"
                                            value={formData.metaDescription}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full p-4 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl focus:ring-2 ring-primary/20 outline-none resize-none"
                                        />
                                        <div className="flex justify-between px-1">
                                            <span className={`text-[10px] uppercase font-bold ${formData.metaDescription.length > 160 ? 'text-red-500' : 'text-muted-foreground'}`}>Characters: {formData.metaDescription.length}/160</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "variants" && (
                            <motion.div
                                key="variants"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-10 bg-white dark:bg-card rounded-[2.5rem] shadow-soft border border-border/50 space-y-8"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-2xl font-bold font-display px-2">Product Variants</h2>
                                    <Button onClick={addVariant} variant="outline" className="rounded-xl border-primary text-primary hover:bg-primary/5 font-bold gap-2">
                                        <Plus className="w-4 h-4" />
                                        Add Variant
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {variants.map((variant, index) => (
                                        <div key={index} className="group p-6 bg-[#F8F9FA] dark:bg-background rounded-[2rem] border border-border/50 hover:border-primary/30 transition-all flex flex-wrap lg:flex-nowrap items-center gap-6">
                                            <div className="flex-1 space-y-1">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Variant Name</span>
                                                <input
                                                    type="text"
                                                    value={variant.name}
                                                    onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                                                    className="w-full bg-transparent border-none p-1 font-bold text-foreground outline-none text-lg"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Price Modifier</span>
                                                <input
                                                    type="number"
                                                    value={variant.price}
                                                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                                    className="w-full bg-transparent border-none p-1 font-bold text-foreground outline-none text-lg"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Stock</span>
                                                <input
                                                    type="number"
                                                    value={variant.stock}
                                                    onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                                    className="w-full bg-transparent border-none p-1 font-bold text-foreground outline-none text-lg"
                                                />
                                            </div>
                                            <Button onClick={() => removeVariant(index)} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive group-hover:bg-destructive/10 rounded-xl transition-all h-12 w-12">
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    ))}
                                    {variants.length === 0 && (
                                        <div className="py-20 border-2 border-dashed border-border/50 rounded-[2.5rem] flex flex-col items-center justify-center text-muted-foreground">
                                            <Layers className="w-12 h-12 mb-4 opacity-10" />
                                            <p className="font-bold text-lg">No variants added yet.</p>
                                            <p className="text-sm">Click the button above to add product options.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "images" && (
                            <motion.div
                                key="images"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-10 bg-white dark:bg-card rounded-[2.5rem] shadow-soft border border-border/50 space-y-8"
                            >
                                <h2 className="text-2xl font-bold font-display px-2">Product Gallery</h2>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <button className="aspect-square rounded-[2rem] border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 group">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Upload className="w-7 h-7 text-primary" />
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Upload Image</span>
                                    </button>

                                    {images.map((img, i) => (
                                        <div key={i} className="aspect-square rounded-[2rem] bg-muted relative group overflow-hidden border border-border/50">
                                            <img src={img} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button size="icon" variant="destructive" className="rounded-xl h-10 w-10"><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
