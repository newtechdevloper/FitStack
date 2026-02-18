
import { notFound } from "next/navigation";

// This page renders for [subdomain].FitStack.com via middleware rewrite
// The subdomain is passed as a param because of the rewrite URL structure: /site/[domain]/page
export default async function TenantSite(props: { params: Promise<{ domain: string }> }) {
    // In a real app, fetch tenant config from DB
    const params = await props.params;
    const { domain } = params;

    // Mock data
    const tenant = {
        name: domain.charAt(0).toUpperCase() + domain.slice(1) + " Gym",
        description: "The best place to workout.",
    };

    if (!domain) return notFound();

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">{tenant.name}</h1>
                    <nav className="space-x-4">
                        <a href="#" className="hover:text-blue-500">Classes</a>
                        <a href="#" className="hover:text-blue-500">Coaches</a>
                        <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded">Join Now</a>
                    </nav>
                </div>
            </header>
            <main className="container mx-auto px-4 py-12">
                <h2 className="text-4xl font-bold mb-4">Welcome to {tenant.name}</h2>
                <p className="text-xl text-gray-600">{tenant.description}</p>

                <div className="mt-12">
                    <h3 className="text-2xl font-semibold mb-4">Upcoming Classes</h3>
                    <div className="bg-white p-6 rounded shadow">
                        <p className="text-gray-500">No classes scheduled yet.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
