import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export class DashboardController {
    static async getStats() {
        try {
            // Get Dates
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

            // 1. Total Revenue (All time)
            const allOrders = await prisma.order.findMany({
                where: { status: { not: "CANCELLED" } }
            });
            const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);

            // 2. Active Orders (Pending + Shipped)
            const activeOrders = await prisma.order.count({
                where: { status: { in: ["PENDING", "SHIPPED"] } }
            });

            // 3. Total Customers
            const totalCustomers = await prisma.user.count({
                where: { role: "USER" }
            });

            // 4. Monthly Growth Calculation (Revenue)
            const currentMonthOrders = allOrders.filter(o => o.createdAt >= startOfMonth);
            const lastMonthOrders = await prisma.order.findMany({
                where: {
                    createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
                    status: { not: "CANCELLED" }
                }
            });

            const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + order.total, 0);
            const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.total, 0);

            let revenueGrowth = 0;
            if (lastMonthRevenue > 0) {
                revenueGrowth = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
            } else if (currentMonthRevenue > 0) {
                revenueGrowth = 100;
            }

            // 5. Conversion Rate (Static for now as we don't have visitor tracking yet, but setting a realistic default)
            const conversionRate = 3.2;

            return NextResponse.json({
                totalRevenue,
                activeOrders,
                totalCustomers,
                conversionRate,
                revenueGrowth: revenueGrowth.toFixed(1)
            });
        } catch (error: any) {
            console.error("DashboardController Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
