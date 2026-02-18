
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-12 lg:px-8">
            <div className="text-center">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Payment Successful!</h2>
                <p className="mt-4 text-lg text-gray-500 max-w-sm mx-auto">
                    Thank you for subscribing. Your account has been upgraded and you now have full access.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        href="/dashboard"
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
