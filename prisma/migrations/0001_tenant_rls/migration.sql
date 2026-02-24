ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tour" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Customer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vendor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmailTemplate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TourVendor" ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_tenant ON "Tenant"
USING ("id"::text = current_setting('app.tenant_id', true))
WITH CHECK ("id"::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_user ON "User"
USING ("tenantId"::text = current_setting('app.tenant_id', true))
WITH CHECK ("tenantId"::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_tour ON "Tour"
USING ("tenantId"::text = current_setting('app.tenant_id', true))
WITH CHECK ("tenantId"::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_booking ON "Booking"
USING ("tenantId"::text = current_setting('app.tenant_id', true))
WITH CHECK ("tenantId"::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_customer ON "Customer"
USING ("tenantId"::text = current_setting('app.tenant_id', true))
WITH CHECK ("tenantId"::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_review ON "Review"
USING ("tenantId"::text = current_setting('app.tenant_id', true))
WITH CHECK ("tenantId"::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_vendor ON "Vendor"
USING ("tenantId"::text = current_setting('app.tenant_id', true))
WITH CHECK ("tenantId"::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_notification ON "Notification"
USING ("tenantId"::text = current_setting('app.tenant_id', true))
WITH CHECK ("tenantId"::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_email_template ON "EmailTemplate"
USING ("tenantId"::text = current_setting('app.tenant_id', true))
WITH CHECK ("tenantId"::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_audit_log ON "AuditLog"
USING ("tenantId"::text = current_setting('app.tenant_id', true))
WITH CHECK ("tenantId"::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_tour_vendor ON "TourVendor"
USING (
  EXISTS (
    SELECT 1
    FROM "Tour"
    WHERE "Tour"."id" = "TourVendor"."tourId"
    AND "Tour"."tenantId"::text = current_setting('app.tenant_id', true)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM "Tour"
    WHERE "Tour"."id" = "TourVendor"."tourId"
    AND "Tour"."tenantId"::text = current_setting('app.tenant_id', true)
  )
);

