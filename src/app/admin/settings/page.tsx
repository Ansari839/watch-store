"use client";

import { useState, useEffect } from "react";
import {
    Settings,
    Palette,
    Check,
    Globe,
    Bell,
    Shield,
    Mail,
    Loader2,
    Save,
    CreditCard,
    TrendingUp,
    Truck,
    AlertCircle,
    Activity,
    Search as SearchIcon,
    Share2
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingsPage() {
    const { theme: currentTheme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState("Store Aura");
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/settings");
            const data = await res.json();
            setSettings(data);
        } catch (error) {
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (sectionData: any) => {
        try {
            setSaving(true);
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sectionData)
            });
            if (res.ok) {
                toast.success("Settings updated successfully");
                fetchSettings();
            }
        } catch (error) {
            toast.error("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    const themes = [
        { id: "default", name: "Luxury Default", color: "bg-[#174e4c]", accent: "bg-[#f59e0b]" },
        { id: "executive", name: "Electric Executive", color: "bg-white", accent: "bg-[#6366f1]" },
        { id: "summer", name: "Mediterranean Summer", color: "bg-[#fffdf5]", accent: "bg-[#00b5ad]" },
        { id: "sunset", name: "Sunset Boutique", color: "bg-[#faf9f6]", accent: "bg-[#ff5a1f]" },
        { id: "cyber", name: "Cyber Mint", color: "bg-white", accent: "bg-[#00ffab]" },
    ] as const;

    const sections = [
        { name: "Store Aura", icon: Palette },
        { name: "Localization", icon: Globe },
        { name: "Communication", icon: Mail },
        { name: "Operations", icon: TrendingUp },
        { name: "Marketing", icon: Share2 },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="font-bold text-muted-foreground">Initializing Preferences...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground tracking-tight text-stroke-sm">Preferences</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Control your store's appearance and behavior.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-10">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    {sections.map((s) => (
                        <button
                            key={s.name}
                            onClick={() => setActiveTab(s.name)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === s.name
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-muted-foreground hover:bg-muted/50"
                                }`}
                        >
                            <s.icon className={`w-5 h-5 ${activeTab === s.name ? "text-white" : "text-muted-foreground"}`} />
                            {s.name}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    {activeTab === "Store Aura" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="bg-white dark:bg-card p-10 rounded-[3rem] border border-border/50 shadow-premium">
                                <h3 className="text-2xl font-bold mb-2">Visual Atmosphere</h3>
                                <p className="text-muted-foreground mb-10">Choose a theme that matches your brand's unique identity.</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {themes.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => {
                                                setTheme(t.id);
                                                toast.success(`Theme updated to ${t.name}`);
                                            }}
                                            className={`group relative p-6 rounded-[2rem] border-2 transition-all duration-300 text-left ${currentTheme === t.id ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30 bg-muted/10 hover:bg-muted/20"}`}
                                        >
                                            <div className="flex flex-col gap-6">
                                                <div className="flex gap-2">
                                                    <div className={`w-12 h-12 rounded-xl ${t.color} border border-border/50 shadow-md`} />
                                                    <div className={`w-12 h-12 rounded-xl ${t.accent} shadow-md`} />
                                                </div>
                                                <div>
                                                    <span className={`text-sm font-bold block mb-1 ${currentTheme === t.id ? "text-primary" : "text-foreground"}`}>{t.name}</span>
                                                    <p className="text-xs text-muted-foreground">Premium styling for custom experience.</p>
                                                </div>
                                            </div>
                                            {currentTheme === t.id && (
                                                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                                                    <Check className="w-4 h-4" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Localization" && (
                        <div className="bg-white dark:bg-card p-10 rounded-[3rem] border border-border/50 shadow-premium">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-2xl font-bold">Localization</h3>
                                    <p className="text-muted-foreground">Configure your store's currency and regional data.</p>
                                </div>
                                <Button onClick={() => handleSave({
                                    currency: settings.currency,
                                    currencySymbol: settings.currencySymbol
                                })} disabled={saving} className="rounded-xl h-12 px-6 bg-primary font-bold">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Regional
                                </Button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Primary Currency</label>
                                    <select
                                        value={settings?.currency || "USD"}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const symbolMap: any = {
                                                'USD': '$',
                                                'PKR': 'Rs',
                                                'EUR': '€',
                                                'GBP': '£',
                                                'AED': 'DH'
                                            };
                                            setSettings({
                                                ...settings,
                                                currency: val,
                                                currencySymbol: symbolMap[val] || settings.currencySymbol
                                            });
                                        }}
                                        className="w-full h-14 bg-muted/20 border border-border/50 rounded-2xl px-6 outline-none focus:ring-2 ring-primary/20 transition-all font-bold"
                                    >
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="PKR">PKR - Pakistani Rupee</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="GBP">GBP - British Pound</option>
                                        <option value="AED">AED - UAE Dirham</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Currency Symbol</label>
                                    <input
                                        type="text"
                                        value={settings?.currencySymbol || "$"}
                                        onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                                        placeholder="e.g. $, Rs, €"
                                        className="w-full h-14 bg-muted/20 border border-border/50 rounded-2xl px-6 outline-none focus:ring-2 ring-primary/20 transition-all font-bold"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Communication" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="bg-white dark:bg-card p-10 rounded-[3rem] border border-border/50 shadow-premium">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h3 className="text-2xl font-bold">Order Notifications</h3>
                                        <p className="text-muted-foreground">Manage how you receive alerts and what customers see.</p>
                                    </div>
                                    <Button onClick={() => handleSave({
                                        adminEmail: settings.adminEmail,
                                        whatsappNumber: settings.whatsappNumber,
                                        orderEmailSubject: settings.orderEmailSubject,
                                        orderEmailBody: settings.orderEmailBody,
                                        whatsappNotify: settings.whatsappNotify
                                    })} disabled={saving} className="rounded-xl h-12 px-6 bg-primary font-bold">
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                        Save Communication
                                    </Button>
                                </div>

                                <div className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Admin Receive Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <input
                                                    type="email"
                                                    value={settings?.adminEmail || ""}
                                                    onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                                                    placeholder="admin@example.com"
                                                    className="w-full h-14 bg-muted/20 border border-border/50 rounded-2xl pl-16 pr-6 outline-none focus:ring-2 ring-primary/20 transition-all font-bold"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Customer WhatsApp Contact</label>
                                            <div className="relative">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                    <CreditCard className="w-5 h-5 text-emerald-500" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={settings?.whatsappNumber || ""}
                                                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                                                    placeholder="+92 300 1234567"
                                                    className="w-full h-14 bg-muted/20 border border-border/50 rounded-2xl pl-16 pr-6 outline-none focus:ring-2 ring-primary/20 transition-all font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-1 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Order Received Template (Subject)</label>
                                            <input
                                                type="text"
                                                value={settings?.orderEmailSubject || ""}
                                                onChange={(e) => setSettings({ ...settings, orderEmailSubject: e.target.value })}
                                                className="w-full h-14 bg-muted/20 border border-border/50 rounded-2xl px-6 outline-none focus:ring-2 ring-primary/20 transition-all font-bold"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Email Body (HTML Supported)</label>
                                            <textarea
                                                value={settings?.orderEmailBody || ""}
                                                onChange={(e) => setSettings({ ...settings, orderEmailBody: e.target.value })}
                                                className="w-full h-64 bg-muted/20 border border-border/50 rounded-2xl p-6 outline-none focus:ring-2 ring-primary/20 transition-all font-mono text-sm leading-relaxed"
                                                placeholder="Enter email template content here..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <CreditCard className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold">WhatsApp Alerts</h4>
                                                <p className="text-xs text-muted-foreground">Notify admin on WhatsApp for every new order.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSettings({ ...settings, whatsappNotify: !settings.whatsappNotify })}
                                            className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${settings?.whatsappNotify ? "bg-primary" : "bg-muted"}`}
                                        >
                                            <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${settings?.whatsappNotify ? "translate-x-6" : "translate-x-0"}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Operations" && (
                        <div className="bg-white dark:bg-card p-10 rounded-[3rem] border border-border/50 shadow-premium">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-2xl font-bold">Operations</h3>
                                    <p className="text-muted-foreground">Update your taxation and logistics logic.</p>
                                </div>
                                <Button onClick={() => handleSave({
                                    taxPercentage: settings.taxPercentage,
                                    shippingFlatRate: settings.shippingFlatRate,
                                    maintenanceMode: settings.maintenanceMode
                                })} disabled={saving} className="rounded-xl h-12 px-6 bg-primary font-bold">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Ops
                                </Button>
                            </div>

                            <div className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tax Percentage (%)</label>
                                        <input
                                            type="number"
                                            value={settings?.taxPercentage || 0}
                                            onChange={(e) => setSettings({ ...settings, taxPercentage: parseFloat(e.target.value) })}
                                            className="w-full h-14 bg-muted/20 border border-border/50 rounded-2xl px-6 outline-none focus:ring-2 ring-primary/20 transition-all font-bold"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Shipping Flat Rate ({settings?.currencySymbol})</label>
                                        <input
                                            type="number"
                                            value={settings?.shippingFlatRate || 0}
                                            onChange={(e) => setSettings({ ...settings, shippingFlatRate: parseFloat(e.target.value) })}
                                            className="w-full h-14 bg-muted/20 border border-border/50 rounded-2xl px-6 outline-none focus:ring-2 ring-primary/20 transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2rem] border-2 border-rose-500/20 bg-rose-500/5 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                                            <AlertCircle className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-rose-500">Maintenance Mode</h4>
                                            <p className="text-muted-foreground font-medium">Instantly close the storefront for maintenance.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                        className={`w-20 h-10 rounded-full transition-all flex items-center px-1.5 ${settings?.maintenanceMode ? "bg-rose-500 shadow-lg shadow-rose-500/30" : "bg-muted"}`}
                                    >
                                        <div className={`w-7 h-7 rounded-full bg-white shadow-md transform transition-transform ${settings?.maintenanceMode ? "translate-x-10" : "translate-x-0"}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Marketing" && (
                        <div className="bg-white dark:bg-card p-10 rounded-[3rem] border border-border/50 shadow-premium">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-2xl font-bold">Marketing & SEO</h3>
                                    <p className="text-muted-foreground">Manage your ad tracking and search engine optimization.</p>
                                </div>
                                <Button onClick={() => handleSave({
                                    metaPixelId: settings.metaPixelId,
                                    googleAnalyticsId: settings.googleAnalyticsId,
                                    siteTitle: settings.siteTitle,
                                    siteDescription: settings.siteDescription,
                                    keywords: settings.keywords
                                })} disabled={saving} className="rounded-xl h-12 px-6 bg-primary font-bold">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Marketing
                                </Button>
                            </div>

                            <div className="space-y-10">
                                {/* Tracking IDs */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Meta Pixel ID (Ads)</label>
                                        <div className="relative">
                                            <Activity className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <input
                                                type="text"
                                                value={settings?.metaPixelId || ""}
                                                onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })}
                                                placeholder="e.g. 1234567890"
                                                className="w-full h-14 bg-muted/20 border border-border/50 rounded-2xl pl-16 pr-6 outline-none focus:ring-2 ring-primary/20 transition-all font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Google Analytics ID</label>
                                        <div className="relative">
                                            <TrendingUp className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <input
                                                type="text"
                                                value={settings?.googleAnalyticsId || ""}
                                                onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                                                placeholder="e.g. G-XXXXXXX"
                                                className="w-full h-14 bg-muted/20 border border-border/50 rounded-2xl pl-16 pr-6 outline-none focus:ring-2 ring-primary/20 transition-all font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SEO Meta */}
                                <div className="pt-8 border-t border-border/50 space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Site Title (For Google)</label>
                                        <input
                                            type="text"
                                            value={settings?.siteTitle || ""}
                                            onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                                            className="w-full h-14 bg-muted/20 border border-border/50 rounded-2xl px-6 outline-none focus:ring-2 ring-primary/20 transition-all font-bold text-xl"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Meta Description</label>
                                        <textarea
                                            value={settings?.siteDescription || ""}
                                            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                            rows={4}
                                            className="w-full bg-muted/20 border border-border/50 rounded-2xl p-6 outline-none focus:ring-2 ring-primary/20 transition-all font-medium leading-relaxed"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Keywords (Comma Separated)</label>
                                        <input
                                            type="text"
                                            value={settings?.keywords || ""}
                                            onChange={(e) => setSettings({ ...settings, keywords: e.target.value })}
                                            placeholder="luxury watches, premium timepieces, brand name"
                                            className="w-full h-14 bg-muted/20 border border-border/50 rounded-2xl px-6 outline-none focus:ring-2 ring-primary/20 transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                {/* Preview Card */}
                                <div className="p-8 rounded-[2rem] bg-slate-900 text-white overflow-hidden relative border border-white/5">
                                    <div className="absolute top-4 right-6 flex items-center gap-1 text-[10px] font-black uppercase text-white/20 tracking-widest">
                                        <SearchIcon className="w-3 h-3" /> Search Preview
                                    </div>
                                    <div className="relative z-10 max-w-2xl">
                                        <h4 className="text-blue-400 text-xl font-medium mb-1 truncate hover:underline cursor-pointer">{settings?.siteTitle || "Watch Store"}</h4>
                                        <p className="text-emerald-500 text-sm mb-2 truncate">https://yourstore.com</p>
                                        <p className="text-white/60 text-sm line-clamp-2 leading-relaxed">
                                            {settings?.siteDescription || "Enter a description to see how your store appears in Google search results."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
