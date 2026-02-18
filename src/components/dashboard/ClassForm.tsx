
"use client";

import { useActionState } from "react";
import { createClass, type ClassActionState } from "@/server/actions/class";
import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
            {pending ? "Saving..." : "Save Class"}
        </button>
    );
}

const initialState: ClassActionState = {};

export function CreateClassForm() {
    const [state, formAction] = useActionState(createClass, initialState);

    return (
        <form action={formAction} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Class Name
                </label>
                <div className="mt-2">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="e.g. Morning Yoga"
                        required
                    />
                </div>
            </div>

            <div>
                <label htmlFor="duration" className="block text-sm font-medium leading-6 text-gray-900">
                    Duration (minutes)
                </label>
                <div className="mt-2">
                    <input
                        type="number"
                        name="duration"
                        id="duration"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={60}
                        required
                    />
                </div>
            </div>

            <div>
                <label htmlFor="capacity" className="block text-sm font-medium leading-6 text-gray-900">
                    Capacity
                </label>
                <div className="mt-2">
                    <input
                        type="number"
                        name="capacity"
                        id="capacity"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={15}
                        required
                    />
                </div>
            </div>

            {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}

            <div className="flex justify-end">
                <SubmitButton />
            </div>
        </form>
    );
}
