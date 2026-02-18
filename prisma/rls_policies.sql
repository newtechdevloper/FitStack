-- Enable Row Level Security
ALTER TABLE "TenantUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MembershipPlan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Class" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Warning: These policies assume the application sets 'app.current_tenant' configuration parameter.

-- TenantUser: Users can only see records for their tenant
CREATE POLICY tenant_isolation_policy ON "TenantUser"
    USING (tenantId = current_setting('app.current_tenant')::text);

-- Booking: Users can only see bookings for their tenant
CREATE POLICY tenant_booking_isolation ON "Booking"
    USING (tenantId = current_setting('app.current_tenant')::text);

-- Class: Users can only see classes for their tenant
CREATE POLICY tenant_class_isolation ON "Class"
    USING (tenantId = current_setting('app.current_tenant')::text);

-- NOTE: To use this, you must run:
-- SET app.current_tenant = 'tenant_id_here';
-- before every query in your transaction.
