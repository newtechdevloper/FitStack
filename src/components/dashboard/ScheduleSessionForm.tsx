
"use client";

import { useActionState } from "react";
import { scheduleSession, type ClassActionState } from "@/server/actions/class";
import { useFormStatus } from "react-dom";

type ClassType = {
    id: string;
    name: string;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
            {pending ? "Scheduling..." : "Schedule Session"}
        </button>
    );
}

const initialState: ClassActionState = {};

export function ScheduleSessionForm({ classes }: { classes: ClassType[] }) {
    const [state, formAction] = useActionState(scheduleSession, initialState);

    return (
        <form action={formAction} className="space-y-4">
            <div>
                <label htmlFor="classId" className="block text-sm font-medium leading-6 text-gray-900">
                    Select Class
                </label>
                <select
                    id="classId"
                    name="classId"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                    {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="startTime" className="block text-sm font-medium leading-6 text-gray-900">
                    Start Time
                </label>
                <div className="mt-2">
                    <input
                        type="datetime-local"
                        name="startTime"
                        id="startTime"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
