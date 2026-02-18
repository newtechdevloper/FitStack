
"use client";

import { useState } from "react";

export function ROICalculator() {
    const [numMembers, setNumMembers] = useState(100);
    const [monthlyFee, setMonthlyFee] = useState(50);

    const monthlyRevenue = numMembers * monthlyFee;
    const nexusCost = 79; // Growth Plan
    const potentialGroth = monthlyRevenue * 1.2; // Assume 20% growth with better tooling

    const roi = ((potentialGroth - monthlyRevenue) / nexusCost) * 100;

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Return on Investment Calculator</h3>

            <div className="space-y-6">
                <div>
                    <label htmlFor="members" className="block text-sm font-medium text-gray-400 mb-2">
                        Active Members: <span className="text-white font-bold">{numMembers}</span>
                    </label>
                    <input
                        type="range"
                        id="members"
                        min="10"
                        max="500"
                        step="10"
                        value={numMembers}
                        onChange={(e) => setNumMembers(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
                    />
                </div>

                <div>
                    <label htmlFor="bee" className="block text-sm font-medium text-gray-400 mb-2">
                        Avg. Monthly Fee: <span className="text-white font-bold">${monthlyFee}</span>
                    </label>
                    <input
                        type="range"
                        id="fee"
                        min="20"
                        max="200"
                        step="5"
                        value={monthlyFee}
                        onChange={(e) => setMonthlyFee(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
                    />
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <p className="text-sm text-gray-400">Current Monthly Revenue</p>
                    <p className="text-2xl font-bold text-white">${monthlyRevenue.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Projected Revenue (+20%)</p>
                    <p className="text-2xl font-bold text-[#4ade80]">${potentialGroth.toLocaleString()}</p>
                </div>
            </div>

            <div className="mt-6 bg-[var(--primary)]/10 rounded-lg p-4 border border-[var(--primary)]/20">
                <p className="text-sm text-[var(--primary)] text-center">
                    For just <strong>${nexusCost}/mo</strong>, you could add <strong>${(potentialGroth - monthlyRevenue).toLocaleString()}</strong> in new revenue.
                    That's a <strong>{roi.toFixed(0)}% ROI</strong>.
                </p>
            </div>
        </div>
    );
}
