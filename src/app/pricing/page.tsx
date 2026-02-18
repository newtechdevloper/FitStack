import Link from "next/link";
import { Check, Zap, HelpCircle } from "lucide-react";
import { ROICalculator } from "@/components/marketing/ROICalculator";

const tiers = [
    {
        name: "Starter",
        id: "tier-starter",
        href: "/signup?plan=starter",
        priceMonthly: "₹2,499",
        description: "Essential tools for bold new gyms.",
        features: [
            "Up to 100 active members",
            "Basic reporting",
            "Class scheduling",
            "Member portal",
        ],
        highlight: false
    },
    {
        name: "Growth",
        id: "tier-growth",
        href: "/signup?plan=growth",
        priceMonthly: "₹6,499",
        description: "For growing gyms that need more power.",
        features: [
            "Unlimited members",
            "Advanced analytics",
            "Automated emails",
            "Priority support",
            "Custom domain",
        ],
        highlight: true
    },
    {
        name: "Pro",
        id: "tier-pro",
        href: "/contact", // Sales contact for enterprise
        priceMonthly: "Custom",
        description: "Maximum performance for multi-location gyms.",
        features: [
            "Multi-location support",
            "White-label mobile app",
            "Dedicated account manager",
            "API access",
            "SLA guarantee",
        ],
        highlight: false
    },
];

const faqs = [
    {
        question: "Do I need a credit card to start?",
        answer: "No! You can create an account and explore the dashboard. You only pay when you're ready to launch."
    },
    {
        question: "Can I cancel anytime?",
        answer: "Yes. There are no long-term contracts. You can cancel or upgrade your plan at any time from the settings."
    },
    {
        question: "What are the transaction fees?",
        answer: "We charge a standard 1% application fee on top of Stripe's processing fees (usually 2.9% + 30¢)."
    },
    {
        question: "Do you offer migration support?",
        answer: "Yes! On the Growth plan and above, our team will help you migrate your member data from other platforms."
    },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)] rounded-full blur-[120px] opacity-10"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--secondary)] rounded-full blur-[120px] opacity-10"></div>
            </div>

            {/* Header */}
            <div className="pt-24 pb-8 sm:pt-32 sm:pb-12 text-center px-6">
                <Link href="/" className="inline-flex items-center gap-2 mb-8 glass-panel px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
                    <Zap className="w-4 h-4 text-[var(--primary)]" />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
                <h2 className="text-base font-semibold leading-7 text-[var(--primary)] text-glow">Pricing</h2>
                <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    Invest in your gym's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">future</span>
                </p>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
                    Simple, transparent pricing that grows with you. No hidden fees.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-24">
                <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={`rounded-3xl p-8 xl:p-10 glass-panel transition-all duration-300 hover:scale-[1.02] flex flex-col ${tier.highlight
                                ? 'ring-2 ring-[var(--primary)] shadow-[0_0_40px_rgba(59,130,246,0.2)] bg-white/5 relative'
                                : 'ring-1 ring-white/10 hover:bg-white/5'
                                }`}
                        >
                            {tier.highlight && (
                                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                                    <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center justify-between gap-x-4">
                                <h3 id={tier.id} className="text-lg font-semibold leading-8 text-white">
                                    {tier.name}
                                </h3>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-gray-400">
                                {tier.description}
                            </p>
                            <p className="mt-6 flex items-baseline gap-x-1">
                                <span className="text-4xl font-bold tracking-tight text-white">{tier.priceMonthly}</span>
                                <span className="text-sm font-semibold leading-6 text-gray-400">/month</span>
                            </p>
                            <Link
                                href={tier.href}
                                aria-describedby={tier.id}
                                className={`mt-6 block rounded-lg px-3 py-2 text-center text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all ${tier.highlight
                                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white hover:shadow-lg hover:shadow-[var(--primary-glow)]'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                {tier.name === "Pro" ? "Contact Sales" : "Start 14-day trial"}
                            </Link>
                            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300 flex-1">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <Check className="h-6 w-5 flex-none text-[var(--primary)]" aria-hidden="true" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* ROI Calculator Section */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-6">
                            See how much you could earn
                        </h2>
                        <p className="text-lg text-gray-400 mb-8">
                            Nexus doesn't just manage your gym—it helps you grow it.
                            Use our calculator to see the potential revenue increase by using our automated retention tools.
                        </p>
                        <div className="flex gap-4">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
                                    <Zap className="w-6 h-6 text-[var(--primary)]" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Automated Retargeting</h4>
                                    <p className="text-sm text-gray-400">Bring back inactive members.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ROICalculator />
                </div>
            </div>

            {/* FAQ Section */}
            <div className="mx-auto max-w-4xl px-6 lg:px-8 mb-32">
                <h2 className="text-2xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
                <div className="grid gap-8">
                    {faqs.map((faq, index) => (
                        <div key={index} className="glass-panel p-6 rounded-2xl">
                            <h3 className="flex items-center gap-3 font-semibold text-white mb-2">
                                <HelpCircle className="w-5 h-5 text-gray-500" />
                                {faq.question}
                            </h3>
                            <p className="text-gray-400 ml-8">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="border-t border-white/10 py-12 text-center text-sm text-gray-500">
                <p>&copy; 2026 Nexus Gym SaaS. All rights reserved.</p>
            </footer>
        </div>
    );
}
