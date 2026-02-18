
// Structured Security Logger
// In production, forward these logs to Datadog / CloudWatch / Sentry

type SecurityEventType =
    | "LOGIN_SUCCESS"
    | "LOGIN_FAILED"
    | "LOGOUT"
    | "MFA_VERIFIED"
    | "MFA_FAILED"
    | "RBAC_VIOLATION"
    | "IDOR_ATTEMPT"
    | "CRON_EXECUTION"
    | "CRON_FAILED"
    | "STRIPE_WEBHOOK_RECEIVED"
    | "STRIPE_WEBHOOK_FAILED"
    | "RAZORPAY_WEBHOOK_RECEIVED"
    | "RAZORPAY_WEBHOOK_FAILED"
    | "RATE_LIMIT_EXCEEDED"
    | "SENSITIVE_DATA_ACCESS";

interface SecurityLogContext {
    userId?: string;
    tenantId?: string;
    ip?: string;
    userAgent?: string;
    resourceId?: string;
    details?: Record<string, any>;
    error?: Error;
}

export const SecurityLogger = {
    info: (event: SecurityEventType, context: SecurityLogContext) => {
        log("INFO", event, context);
    },
    warn: (event: SecurityEventType, context: SecurityLogContext) => {
        log("WARN", event, context);
    },
    error: (event: SecurityEventType, context: SecurityLogContext) => {
        log("ERROR", event, context);
    }
};

function log(level: "INFO" | "WARN" | "ERROR", event: SecurityEventType, context: SecurityLogContext) {
    const timestamp = new Date().toISOString();

    // Redact sensitive keys from details
    const safeDetails = redact(context.details);

    const logPayload = {
        timestamp,
        level,
        event,
        userId: context.userId || "anonymous",
        tenantId: context.tenantId || "system",
        ip: context.ip,
        resourceId: context.resourceId,
        details: safeDetails,
        error: context.error ? { message: context.error.message, stack: context.error.stack } : undefined
    };

    // In local dev, pretty print
    if (process.env.NODE_ENV === "development") {
        const color = level === "ERROR" ? "\x1b[31m" : level === "WARN" ? "\x1b[33m" : "\x1b[36m";
        const reset = "\x1b[0m";
        console.log(`${color}[SECURITY] [${event}]${reset}`, JSON.stringify(logPayload, null, 2));
    } else {
        // In production, JSON stringify for log aggregators
        console.log(JSON.stringify(logPayload));
    }

    // TODO: If Sentry is initialized, captureException for ERRORs
    // if (level === "ERROR" && context.error) {
    //    Sentry.captureException(context.error, { tags: { security_event: event } });
    // }
}

function redact(obj?: Record<string, any>): Record<string, any> | undefined {
    if (!obj) return undefined;
    const sensitiveKeys = ["password", "token", "secret", "credit_card", "cvv", "stripeSignature", "razorpaySignature"];
    const newObj = { ...obj };

    for (const key of Object.keys(newObj)) {
        if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
            newObj[key] = "[REDACTED]";
        } else if (typeof newObj[key] === "object") {
            newObj[key] = redact(newObj[key]);
        }
    }
    return newObj;
}
