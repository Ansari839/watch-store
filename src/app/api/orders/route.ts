import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotificationService } from "@/lib/services/NotificationService";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            items,
            total,
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            whatsappEnabled
        } = body;

        // Create Order and Items in a transaction
        const order = await prisma.order.create({
            data: {
                total,
                status: "Pending",
                customerName,
                customerEmail,
                customerPhone,
                shippingAddress,
                whatsappEnabled,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        variant: item.variant
                    }))
                }
            }
        });

        // Trigger "Order Placed" Notification
        NotificationService.sendOrderPlacedNotification(order);

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: "Failed to process order" }, { status: 500 });
    }
}
