"use client";

import { useActionState } from "react";
import { registerTenant, type TenantActionState } from "@/server/actions/tenant";
import { useFormStatus } from "react-dom";
import { Building2 } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
            {pending ? "Creating..." : "Create Gym"}
        </button>
    );
}

const initialState: TenantActionState = {
    error: null,
};

export default function OnboardingPage() {
    const [state, formAction] = useActionState(registerTenant, initialState);

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50 h-screen">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <Building2 className="h-8 w-8" />
                </div>
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Set up your Gym
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Create your workspace to start managing members.
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form action={formAction} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                            Gym Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Iron Abs Fitness"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium leading-6 text-gray-900">
                            Subdomain (Slug)
                        </label>
                        <div className="mt-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input
                                type="text"
                                name="slug"
                                id="slug"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="iron-abs"
                            />
                            <span className="flex select-none items-center pr-3 text-gray-500 sm:text-sm">.gymnexus.com</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">This will be your website address.</p>
                    </div>

                    {state?.error && (
                        <div className="text-red-600 text-sm text-center">
                            {typeof state.error === 'string' ? state.error : "Please check your inputs."}
                        </div>
                    )}

                    <div>
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
