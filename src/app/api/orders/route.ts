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
            whatsappEnabled,
            discountCode,
            discountAmount
        } = body;

        // Create Order and Items in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    total,
                    status: "Pending",
                    customerName,
                    customerEmail,
                    customerPhone,
                    shippingAddress,
                    whatsappEnabled,
                    discountCode,
                    discountAmount: discountAmount || 0,
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

            // If coupon used, increment usage count
            if (discountCode) {
                await tx.coupon.update({
                    where: { code: discountCode.toUpperCase() },
                    data: { usageCount: { increment: 1 } }
                });
            }

            return order;
        });

        // Trigger "Order Placed" Notification
        NotificationService.sendOrderPlacedNotification(result);

        return NextResponse.json({ success: true, orderId: result.id });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: "Failed to process order" }, { status: 500 });
    }
}
