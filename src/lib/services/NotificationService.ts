/**
 * NotificationService handles multi-channel communication (WhatsApp, Email, SMS)
 * for order status updates and customer inquiries.
 */
export class NotificationService {
    static async sendOrderPlacedNotification(orderData: any) {
        const { id, customerName, customerEmail, customerPhone, total, whatsappEnabled } = orderData;

        console.log(`--- [NOTIFICATION SYSTEM: ORDER PLACED] ---`);

        // 1. Email Logic
        const emailSubject = `Order Confirmation - #${id}`;
        const emailBody = `Dear ${customerName}, thank you for your purchase of ${total}. Your order is being processed.`;
        console.log(`[SMTP/MOCK] To: ${customerEmail} | Subject: ${emailSubject}`);
        console.log(`[Content]: ${emailBody}`);

        // 2. Mobile Logic
        const mobileMessage = `Timecraft: Order #${id} placed! Total: ${total}. We'll notify you when it ships.`;

        if (whatsappEnabled) {
            console.log(`[WHATSAPP/MOCK] To: ${customerPhone} | Message: ${mobileMessage}`);
        } else {
            console.log(`[SMS/MOCK] To: ${customerPhone} | Message: ${mobileMessage}`);
        }

        console.log(`-------------------------------------------`);
    }

    static async sendStatusUpdateNotification(orderData: any, newStatus: string) {
        const { id, customerName, customerEmail, customerPhone, whatsappEnabled } = orderData;

        console.log(`--- [NOTIFICATION SYSTEM: STATUS UPDATE] ---`);
        const message = `Order #${id} update: Your order is now ${newStatus.toUpperCase()}.`;

        // Email
        console.log(`[SMTP/MOCK] To: ${customerEmail} | Subject: Order #${id} Status Update`);
        console.log(`[Content]: Dear ${customerName}, ${message}`);

        // Mobile
        if (whatsappEnabled) {
            console.log(`[WHATSAPP/MOCK] To: ${customerPhone} | Message: ${message}`);
        } else {
            console.log(`[SMS/MOCK] To: ${customerPhone} | Message: ${message}`);
        }
        console.log(`--------------------------------------------`);
    }

    static getWhatsAppInquiryLink(productName: string) {
        const adminNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "1234567890";
        const message = encodeURIComponent(`Hello Timecraft, I'm interested in the "${productName}". Could you share more details?`);
        return `https://wa.me/${adminNumber}?text=${message}`;
    }
}
