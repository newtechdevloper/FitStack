
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia' as any, // Updated to a known stable version or match package.json
    typescript: true,
});

export const PLANS = {
    starter: "price_1Q...", // Replace with real Price ID
    growth: "price_1Q...",  // Replace with real Price ID
};

// Metered Items to add to every subscription
export const METERED_ITEMS = {
    sms: "price_metered_sms_...",      // Replace with real Metered Price ID for SMS
    whatsapp: "price_metered_wa_...", // Replace with real Metered Price ID for WhatsApp
};
