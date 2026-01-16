import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export class AnalyticsController {
    static async getDetailedAnalytics(period: string = "Week") {
        try {
            const now = new Date();
            let startDate: Date;
            let groupFormat: "hour" | "day" | "month" = "day";
            let limit = 7;

            switch (period.toLowerCase()) {
                case "day":
                    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    groupFormat = "hour";
                    limit = 24;
                    break;
                case "month":
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    groupFormat = "day";
                    limit = 30;
                    break;
                case "year":
                    startDate = new Date(now.getFullYear(), 0, 1); // Start of year
                    groupFormat = "month";
                    limit = 12;
                    break;
                case "week":
                default:
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    groupFormat = "day";
                    limit = 7;
                    break;
            }

            // 1. Revenue Trend Data
            const orders = await prisma.order.findMany({
                where: {
                    createdAt: { gte: startDate },
                    status: { not: "CANCELLED" }
                },
                select: {
                    total: true,
                    createdAt: true
                }
            });

            let trendData: any[] = [];

            if (groupFormat === "hour") {
                trendData = Array.from({ length: 24 }).map((_, i) => {
                    const date = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
                    const hour = date.getHours();
                    const total = orders
                        .filter(o => o.createdAt.getHours() === hour && o.createdAt.toDateString() === date.toDateString())
                        .reduce((sum, o) => sum + o.total, 0);
                    return { label: `${hour}:00`, value: Math.round(total) };
                });
            } else if (groupFormat === "day") {
                const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                trendData = Array.from({ length: limit }).map((_, i) => {
                    const date = new Date(now.getTime() - (limit - 1 - i) * 24 * 60 * 60 * 1000);
                    const label = limit > 7 ? `${date.getDate()}/${date.getMonth() + 1}` : days[date.getDay()];
                    const total = orders
                        .filter(o => o.createdAt.toDateString() === date.toDateString())
                        .reduce((sum, o) => sum + o.total, 0);
                    return { label, value: Math.round(total / (limit > 7 ? 1 : 1000)) }; // Use K only for short periods if needed
                });
            } else if (groupFormat === "month") {
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                trendData = Array.from({ length: 12 }).map((_, i) => {
                    const monthIdx = i;
                    const total = orders
                        .filter(o => o.createdAt.getMonth() === monthIdx)
                        .reduce((sum, o) => sum + o.total, 0);
                    return { label: months[monthIdx], value: Math.round(total / 1000) };
                });
            }

            // 2. Category Share & Performance
            const categories = await prisma.category.findMany({
                include: {
                    products: {
                        include: {
                            orderItems: {
                                include: { order: true }
                            }
                        }
                    }
                }
            });

            const categoryPerformance = categories.map(cat => {
                let revenue = 0;
                cat.products.forEach(prod => {
                    prod.orderItems.forEach(item => {
                        if (item.order.status !== "CANCELLED" && item.order.createdAt >= startDate) {
                            revenue += item.price * item.quantity;
                        }
                    });
                });
                return {
                    name: cat.name,
                    revenue,
                    share: 0
                };
            });

            const totalCatRevenue = categoryPerformance.reduce((sum, c) => sum + c.revenue, 0);
            const formattedCategoryStats = categoryPerformance.map(c => ({
                ...c,
                share: totalCatRevenue > 0 ? Math.round((c.revenue / totalCatRevenue) * 100) : 0
            })).sort((a, b) => b.revenue - a.revenue);

            // 3. Advanced KPIs
            const deliveredOrders = await prisma.order.findMany({
                where: { status: "DELIVERED" }
            });
            const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
            const avgOrderValue = deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0;

            return NextResponse.json({
                trendData,
                categoryStats: formattedCategoryStats,
                kpis: {
                    avgOrderValue: Math.round(avgOrderValue),
                    totalRevenue: Math.round(totalRevenue),
                    deliveredCount: deliveredOrders.length
                }
            });
        } catch (error: any) {
            console.error("AnalyticsController Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
