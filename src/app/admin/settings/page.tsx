import { Save, AlertTriangle } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white bg-gradient-to-r from-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                    Platform Settings
                </h1>
                <p className="text-zinc-400 mt-2">
                    Configure global parameters and system defaults.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* General Settings */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-white">General Configuration</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Support Email</label>
                            <input
                                type="email"
                                defaultValue="support@gymnexus.com"
                                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Platform Name</label>
                            <input
                                type="text"
                                defaultValue="GymNexus"
                                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500/50 outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-900 font-medium hover:bg-zinc-200 transition-colors">
                            <Save className="h-4 w-4" />
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="rounded-2xl border border-red-900/20 bg-red-900/5 backdrop-blur-md p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-red-900/10 border border-red-900/20">
                            <div>
                                <div className="text-white font-medium">Maintenance Mode</div>
                                <div className="text-sm text-red-300/60">Disable access for all non-admin users.</div>
                            </div>
                            <div className="h-6 w-11 rounded-full bg-zinc-800 border-zinc-700 relative">
                                <div className="h-4 w-4 rounded-full bg-zinc-500 absolute top-1 left-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
