"use client";

import { useState } from "react";
import {
    Settings,
    Palette,
    Check,
    Globe,
    Bell,
    Shield,
    Mail,
    Smartphone
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingsPage() {
    const { theme: currentTheme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState("Store Aura");

    const themes = [
        { id: "default", name: "Luxury Default", color: "bg-[#174e4c]", accent: "bg-[#f59e0b]" },
        { id: "executive", name: "Electric Executive", color: "bg-white", accent: "bg-[#6366f1]" },
        { id: "summer", name: "Mediterranean Summer", color: "bg-[#fffdf5]", accent: "bg-[#00b5ad]" },
        { id: "sunset", name: "Sunset Boutique", color: "bg-[#faf9f6]", accent: "bg-[#ff5a1f]" },
        { id: "cyber", name: "Cyber Mint", color: "bg-white", accent: "bg-[#00ffab]" },
    ] as const;

    const sections = [
        { name: "Store Aura", icon: Palette },
        { name: "General Settings", icon: Settings },
        { name: "Regional", icon: Globe },
        { name: "Notifications", icon: Bell },
        { name: "Security", icon: Shield },
    ];

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground tracking-tight text-stroke-sm">Preferences</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Control your store's appearance and behavior.</p>
                </div>
                <Button className="rounded-2xl h-14 px-8 bg-primary font-bold shadow-lg shadow-primary/20">
                    Save Changes
                </Button>
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

                    {activeTab !== "Store Aura" && (
                        <div className="bg-white dark:bg-card p-10 rounded-[3rem] border border-border/50 shadow-premium min-h-[400px] flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-6">
                                <Settings className="w-10 h-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{activeTab} Details</h3>
                            <p className="text-muted-foreground max-w-sm">Configuration for {activeTab} will be available in the next system update. Use Store Aura for immediate UI customization.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
