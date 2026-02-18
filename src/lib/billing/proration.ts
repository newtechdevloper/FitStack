import { Decimal } from "@prisma/client/runtime/library";

interface ProrationParams {
    currentPlanPrice: number;
    newPlanPrice: number;
    daysInPeriod: number;
    daysRemaining: number;
}

interface ProrationResult {
    creditAmount: number; // Value of remaining time on old plan
    chargeAmount: number; // Cost of remaining time on new plan
    netAmount: number;    // What the user pays NOW (positive) or gets credited (negative)
}

/**
 * Calculates the proration amount when switching plans mid-cycle.
 * 
 * Formula:
 * Unused Value = CurrentPrice * (DaysRemaining / TotalDays)
 * New Value = NewPrice * (DaysRemaining / TotalDays)
 * Net = New Value - Unused Value
 * 
 * Example:
 * Switch from $30 plan to $60 plan with 15/30 days remaining.
 * Unused = 30 * 0.5 = $15
 * New Cost = 60 * 0.5 = $30
 * Net Pay = $30 - $15 = $15.
 */
export function calculateProration({
    currentPlanPrice,
    newPlanPrice,
    daysInPeriod,
    daysRemaining
}: ProrationParams): ProrationResult {

    if (daysInPeriod <= 0) throw new Error("daysInPeriod must be positive");
    if (daysRemaining < 0) daysRemaining = 0;
    if (daysRemaining > daysInPeriod) daysRemaining = daysInPeriod;

    const fraction = daysRemaining / daysInPeriod;

    const unusedValue = currentPlanPrice * fraction;
    const newValue = newPlanPrice * fraction;

    // Round to 2 decimal places to match currency standard
    const creditAmount = Math.round(unusedValue * 100) / 100;
    const chargeAmount = Math.round(newValue * 100) / 100;
    const netAmount = Math.round((chargeAmount - creditAmount) * 100) / 100;

    return {
        creditAmount,
        chargeAmount,
        netAmount
    };
}
