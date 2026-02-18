
import Stripe from 'stripe';

let stripeInstance: Stripe;

export const getStripe = () => {
    if (!stripeInstance) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY is missing. Cannot initialize Stripe.");
        }
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2024-11-20.acacia' as any,
            typescript: true,
        });
    }
    return stripeInstance;
};

export const PLANS = {
    starter: "price_1Q...", // Replace with real Price ID
    growth: "price_1Q...",  // Replace with real Price ID
};

// Metered Items to add to every subscription
export const METERED_ITEMS = {
    sms: "price_metered_sms_...",      // Replace with real Metered Price ID for SMS
    whatsapp: "price_metered_wa_...", // Replace with real Metered Price ID for WhatsApp
};
