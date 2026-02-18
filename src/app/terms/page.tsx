
import React from 'react';

export default function TermsPage() {
    return (
        <div className="bg-white px-6 py-32 lg:px-8">
            <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Terms of Service</h1>
                <p className="mt-6 text-xl leading-8">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
                <div className="mt-10 max-w-2xl">
                    <p>
                        Welcome to GymNexus. By accessing or using our website and services, you agree to be bound by these Terms of Service and our Privacy Policy.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">1. Services</h2>
                    <p className="mt-6">
                        GymNexus provides a management platform for gym owners ("Tenants") to manage their members, classes, and billing. We grant you a limited, non-exclusive, non-transferable license to use our Service.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">2. Accounts</h2>
                    <p className="mt-6">
                        You must provide accurate information when creating an account. You are responsible for maintaining the security of your account and password. GymNexus is not liable for any loss or damage from your failure to comply with this security obligation.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">3. Payments and Billing</h2>
                    <p className="mt-6">
                        Services are billed on a subscription basis ("Subscription"). You agree to pay all fees associated with your Plan. We use Stripe for payment processing and do not store your credit card details.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">4. Termination</h2>
                    <p className="mt-6">
                        We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">5. Limitation of Liability</h2>
                    <p className="mt-6">
                        In no event shall GymNexus, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                    </p>
                </div>
            </div>
        </div>
    );
}
