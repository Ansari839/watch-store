import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export class CustomerController {
    static async getAll() {
        try {
            const users = await prisma.user.findMany({
                include: {
                    orders: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            });

            const formattedCustomers = users.map(user => {
                const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0);
                return {
                    id: user.id,
                    name: user.name || "Unknown User",
                    email: user.email || "No Email",
                    role: user.role,
                    createdAt: user.createdAt,
                    orderCount: user.orders.length,
                    totalSpent: totalSpent,
                    // Note: phone mapping would need a more robust approach if stored elsewhere
                    phone: user.orders[0]?.customerPhone || "N/A"
                };
            });

            return NextResponse.json(formattedCustomers);
        } catch (error: any) {
            console.error("CustomerController Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
