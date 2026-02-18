
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

// Price IDs loaded from environment variables.
// Set these in your Vercel dashboard and .env.local:
//   STRIPE_PRICE_STARTER=price_xxx
//   STRIPE_PRICE_GROWTH=price_xxx
//   STRIPE_PRICE_METERED_SMS=price_xxx
//   STRIPE_PRICE_METERED_WHATSAPP=price_xxx
export const PLANS = {
    starter: process.env.STRIPE_PRICE_STARTER ?? "",
    growth: process.env.STRIPE_PRICE_GROWTH ?? "",
};

// Metered Items to add to every subscription
export const METERED_ITEMS = {
    sms: process.env.STRIPE_PRICE_METERED_SMS ?? "",
    whatsapp: process.env.STRIPE_PRICE_METERED_WHATSAPP ?? "",
};
