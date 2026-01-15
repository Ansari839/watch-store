import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = 'force-dynamic';

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" as any })
    : null;

export async function POST(req: Request) {
    try {
        if (!stripe) {
            return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
        }
        const { items, customerEmail, customerName, shippingAddress, customerPhone, whatsappEnabled } = await req.json();

        // In a real app, you'd calculate the price on the server
        const line_items = items.map((item: any) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                    images: [item.image],
                },
                unit_amount: item.price * 100, // Stripe expects cents
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
            customer_email: customerEmail,
            metadata: {
                customerName,
                shippingAddress,
                customerPhone,
                whatsappEnabled: whatsappEnabled.toString(),
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
