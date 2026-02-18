
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";

export function MemberSearch() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }

        startTransition(() => {
            replace(`${pathname}?${params.toString()}`);
        });
    }

    return (
        <div className="relative flex-1 md:w-64 md:flex-none">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <input
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Search members..."
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("search")?.toString()}
            />
            {isPending && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600"></span>
                </div>
            )}
        </div>
    );
}
