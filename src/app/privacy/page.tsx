
import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="bg-white px-6 py-32 lg:px-8">
            <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Privacy Policy</h1>
                <p className="mt-6 text-xl leading-8">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
                <div className="mt-10 max-w-2xl">
                    <p>
                        Your privacy is important to us. It is FitStack's policy to respect your privacy regarding any information we may collect from you across our website.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">1. Information We Collect</h2>
                    <p className="mt-6">
                        We collect information you provide directly to us, such as when you create an account, subscribe to a plan, or contact customer support. This may include your name, email address, and gym details.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">2. How We Use Information</h2>
                    <p className="mt-6">
                        We use the information we collect to operate, maintain, and improve our services, processing transactions, and sending you related information, including confirmations and invoices.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">3. Data Sharing</h2>
                    <p className="mt-6">
                        We do not share your personal information with third parties except as necessary to provide our services (e.g., payment processing via Stripe) or as required by law.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">4. Security</h2>
                    <p className="mt-6">
                        We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">5. Contact Us</h2>
                    <p className="mt-6">
                        If you have any questions about this Privacy Policy, please contact us at support@FitStack.com.
                    </p>
                </div>
            </div>
        </div>
    );
}
