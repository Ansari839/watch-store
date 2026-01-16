"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface StoreSettings {
    currency: string;
    currencySymbol: string;
    whatsappNumber: string;
    siteTitle: string;
    siteDescription: string;
    keywords: string;
    maintenanceMode: boolean;
    whatsappNotify: boolean;
}

interface StoreContextType {
    settings: StoreSettings;
    loading: boolean;
}

const defaultSettings: StoreSettings = {
    currency: "USD",
    currencySymbol: "$",
    whatsappNumber: "",
    siteTitle: "Watch Store",
    siteDescription: "Premium Timepieces",
    keywords: "watches, luxury",
    maintenanceMode: false,
    whatsappNotify: true
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (!data.error) {
                    setSettings(data);
                }
            } catch (error) {
                console.error("Failed to fetch store settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return (
        <StoreContext.Provider value={{ settings, loading }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
