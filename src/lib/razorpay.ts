
import Razorpay from 'razorpay';

// Lazy singleton — only initialized when first called at runtime
let razorpayInstance: Razorpay;

export const getRazorpay = () => {
    if (!razorpayInstance) {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new Error("RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing.");
        }
        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    return razorpayInstance;
};

// Plan IDs from Razorpay Dashboard → Subscriptions → Plans
// Set these in your Vercel dashboard:
//   RAZORPAY_PLAN_STARTER=plan_xxx
//   RAZORPAY_PLAN_GROWTH=plan_xxx
export const PLANS = {
    starter: process.env.RAZORPAY_PLAN_STARTER ?? "",
    growth: process.env.RAZORPAY_PLAN_GROWTH ?? "",
};
