"use client";

import {useMemo, useState} from "react";

type TenantSettingsTenant = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  coverImageUrl: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  defaultCurrency: string;
  supportedCurrencies: string[];
  defaultLocale: string;
  supportedLocales: string[];
  contactEmail: string;
  contactPhone: string;
  address: string;
  country: string;
  socialLinks: Record<string, string>;
  rawSettings: Record<string, unknown>;
};

type SettingsDashboardClientProps = {
  locale: string;
  tenant: TenantSettingsTenant;
};

type SettingsTabId =
  | "branding"
  | "localization"
  | "booking"
  | "emails"
  | "payments"
  | "integrations"
  | "danger";

export function SettingsDashboardClient(props: SettingsDashboardClientProps) {
  const {tenant} = props;
  const [activeTab, setActiveTab] = useState<SettingsTabId>("branding");

  const socialLinksEntries = useMemo(
    () => Object.entries(tenant.socialLinks ?? {}),
    [tenant.socialLinks],
  );

  return (
    <section className="space-y-4 rounded-3xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl">
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <SettingsTabButton
          id="branding"
          label="Company branding"
          active={activeTab === "branding"}
          onClick={setActiveTab}
        />
        <SettingsTabButton
          id="localization"
          label="Localization"
          active={activeTab === "localization"}
          onClick={setActiveTab}
        />
        <SettingsTabButton
          id="booking"
          label="Booking settings"
          active={activeTab === "booking"}
          onClick={setActiveTab}
        />
        <SettingsTabButton
          id="emails"
          label="Email templates"
          active={activeTab === "emails"}
          onClick={setActiveTab}
        />
        <SettingsTabButton
          id="payments"
          label="Payment settings"
          active={activeTab === "payments"}
          onClick={setActiveTab}
        />
        <SettingsTabButton
          id="integrations"
          label="Integrations"
          active={activeTab === "integrations"}
          onClick={setActiveTab}
        />
        <SettingsTabButton
          id="danger"
          label="Danger zone"
          active={activeTab === "danger"}
          onClick={setActiveTab}
        />
      </div>

      {activeTab === "branding" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 text-[11px] text-neutral-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Company branding
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-[11px] text-neutral-400">
                  Company name
                </label>
                <input
                  disabled
                  defaultValue={tenant.name}
                  className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] text-neutral-400">Tagline</label>
                <input
                  disabled
                  placeholder="Wire to tenant.settings.branding.tagline"
                  className="h-8 w-full rounded-full border border-dashed border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-500 outline-none"
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-[11px] text-neutral-400">Logo</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-neutral-50">
                    {tenant.name
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <button className="rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-[11px] text-neutral-100 hover:bg-neutral-900">
                    Upload logo
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] text-neutral-400">Cover image</p>
                <button className="rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-[11px] text-neutral-100 hover:bg-neutral-900">
                  Upload cover image
                </button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-[11px] text-neutral-400">
                  Primary color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    disabled
                    type="color"
                    value={tenant.primaryColor}
                    className="h-8 w-16 cursor-pointer rounded-full border border-neutral-700 bg-neutral-950"
                  />
                  <input
                    disabled
                    value={tenant.primaryColor}
                    className="h-8 flex-1 rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] text-neutral-400">
                  Accent color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    disabled
                    type="color"
                    value={tenant.accentColor}
                    className="h-8 w-16 cursor-pointer rounded-full border border-neutral-700 bg-neutral-950"
                  />
                  <input
                    disabled
                    value={tenant.accentColor}
                    className="h-8 flex-1 rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] text-neutral-400">
                Company description
              </label>
              <textarea
                disabled
                rows={4}
                defaultValue={tenant.description}
                placeholder="Wire to tenant.description and public marketing site."
                className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-[11px] text-neutral-100 outline-none"
              />
            </div>

            <div className="space-y-2">
              <p className="text-[11px] text-neutral-400">Social links</p>
              <div className="grid gap-2 md:grid-cols-2">
                {["facebook", "instagram", "twitter", "youtube", "tripadvisor"].map(
                  (key) => (
                    <div key={key} className="space-y-1">
                      <label className="block text-[11px] capitalize text-neutral-400">
                        {key}
                      </label>
                      <input
                        disabled
                        defaultValue={tenant.socialLinks[key] ?? ""}
                        placeholder={`Wire ${key} URL to tenant.socialLinks.${key}`}
                        className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
                      />
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/40 p-4 text-[11px] text-neutral-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Public site preview
            </p>
            <p className="text-[11px] text-neutral-400">
              This panel should render a live preview of the public marketing site using
              the selected branding and colors.
            </p>
            <div className="mt-2 space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3">
              <div
                className="flex h-16 items-center justify-between rounded-2xl px-4"
                style={{
                  background: `linear-gradient(135deg, ${tenant.primaryColor}, ${tenant.accentColor})`,
                }}
              >
                <span className="text-[13px] font-semibold text-white">
                  {tenant.name}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] text-white">
                  Explore tours
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-neutral-300">
                <div className="rounded-xl bg-neutral-900/80 p-2">
                  <p className="font-semibold">Signature trips</p>
                  <p className="mt-1 text-neutral-500">
                    Highlight 3 hero tours from your catalog.
                  </p>
                </div>
                <div className="rounded-xl bg-neutral-900/80 p-2">
                  <p className="font-semibold">Why travel with you</p>
                  <p className="mt-1 text-neutral-500">
                    Pull from your company description.
                  </p>
                </div>
                <div className="rounded-xl bg-neutral-900/80 p-2">
                  <p className="font-semibold">Social proof</p>
                  <p className="mt-1 text-neutral-500">
                    Integrate reviews and social media.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {socialLinksEntries.length === 0 && (
                  <span className="text-[10px] text-neutral-500">
                    Add social links to see them here.
                  </span>
                )}
                {socialLinksEntries.map(([key]) => (
                  <span
                    key={key}
                    className="rounded-full bg-neutral-900 px-2 py-1 text-[10px] capitalize text-neutral-200"
                  >
                    {key}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "localization" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 text-[11px] text-neutral-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Languages and currencies
            </p>
            <div className="space-y-1">
              <label className="block text-[11px] text-neutral-400">
                Default language
              </label>
              <input
                disabled
                defaultValue={tenant.defaultLocale}
                className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] text-neutral-400">
                Additional languages
              </label>
              <input
                disabled
                defaultValue={tenant.supportedLocales.join(", ")}
                className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] text-neutral-400">
                Default currency
              </label>
              <input
                disabled
                defaultValue={tenant.defaultCurrency}
                className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] text-neutral-400">
                Supported currencies
              </label>
              <input
                disabled
                defaultValue={tenant.supportedCurrencies.join(", ")}
                className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 text-[11px] text-neutral-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Formats and units
            </p>
            <div className="space-y-1">
              <label className="block text-[11px] text-neutral-400">Date format</label>
              <select
                disabled
                className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              >
                <option value="dmy">DD.MM.YYYY</option>
                <option value="mdy">MM/DD/YYYY</option>
                <option value="ymd">YYYY-MM-DD</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] text-neutral-400">Time zone</label>
              <input
                disabled
                placeholder="Wire to tenant.settings.localization.timeZone"
                className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] text-neutral-400">Number format</label>
              <select
                disabled
                className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              >
                <option value="us">1,000.00</option>
                <option value="eu">1.000,00</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] text-neutral-400">
                Distance unit
              </label>
              <select
                disabled
                className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              >
                <option value="km">Kilometres</option>
                <option value="mi">Miles</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeTab === "booking" && (
        <div className="space-y-4 rounded-3xl border border-neutral-800 bg-neutral-950/80 p-4 text-[11px] text-neutral-200">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Booking settings
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-[11px] text-neutral-400">
                  Advance booking requirement (days)
                </label>
                <input
                  disabled
                  placeholder="e.g. 3"
                  className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] text-neutral-400">
                  Maximum booking window (months)
                </label>
                <input
                  disabled
                  placeholder="e.g. 12"
                  className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-[11px] text-neutral-400">
                  Auto-confirm bookings
                </label>
                <select
                  disabled
                  className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
                >
                  <option value="on">Enabled</option>
                  <option value="off">Disabled</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] text-neutral-400">
                  Minimum deposit (%)
                </label>
                <input
                  disabled
                  placeholder="e.g. 30"
                  className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] text-neutral-400">
                Booking cancellation policy
              </label>
              <textarea
                disabled
                rows={4}
                placeholder="Select preset or enter custom policy text."
                className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-[11px] text-neutral-100 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] text-neutral-400">
                Currency display on public site
              </label>
              <select
                disabled
                className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              >
                <option value="tenant">Tenant default currency only</option>
                <option value="visitor">
                  Visitor currency where exchange rates available
                </option>
              </select>
            </div>
          </div>

          <div className="space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3">
            <p className="text-[11px] font-semibold text-neutral-200">
              Role permissions matrix
            </p>
            <p className="text-[11px] text-neutral-400">
              Visual overview of which roles can access each core feature. Wire this to the
              actual authorization layer.
            </p>
            <div className="mt-2 overflow-x-auto rounded-2xl border border-neutral-800">
              <table className="w-full border-collapse text-[10px]">
                <thead className="bg-neutral-900/80 text-neutral-300">
                  <tr>
                    <th className="px-3 py-2 text-left">Feature</th>
                    <th className="px-3 py-2 text-center">Admin</th>
                    <th className="px-3 py-2 text-center">Sales</th>
                    <th className="px-3 py-2 text-center">Support</th>
                    <th className="px-3 py-2 text-center">Guide</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "Manage tours",
                    "Manage bookings",
                    "View financials",
                    "Configure settings",
                    "Export data",
                  ].map((feature) => (
                    <tr key={feature} className="border-t border-neutral-800">
                      <td className="px-3 py-2 text-neutral-200">{feature}</td>
                      <td className="px-3 py-2 text-center text-emerald-400">✅</td>
                      <td className="px-3 py-2 text-center text-neutral-300">
                        {feature === "Configure settings" || feature === "Export data"
                          ? "❌"
                          : "✅"}
                      </td>
                      <td className="px-3 py-2 text-center text-neutral-300">
                        {feature === "View financials" ? "👁️" : "✅"}
                      </td>
                      <td className="px-3 py-2 text-center text-neutral-300">
                        {feature === "Manage bookings" ? "✅" : "👁️"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "emails" && (
        <div className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 text-[11px] text-neutral-200">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Email templates
          </p>
          <p className="text-[11px] text-neutral-400">
            Templates are stored in the EmailTemplate table. Wire this tab to list and edit
            tenant-specific templates and render React Email previews.
          </p>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Booking Confirmation",
              "Booking Cancellation",
              "Payment Received",
              "Tour Reminder",
              "Review Request",
              "Welcome Email",
              "Password Reset",
            ].map((name) => (
              <div
                key={name}
                className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3"
              >
                <div>
                  <p className="text-[11px] font-semibold text-neutral-100">{name}</p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Wire to React Email template and HTML editor with variables.
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1">
                  <button className="rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1 text-[11px] text-neutral-100 hover:bg-neutral-900">
                    Edit template
                  </button>
                  <button className="rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1 text-[11px] text-neutral-100 hover:bg-neutral-900">
                    Preview
                  </button>
                  <button className="rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1 text-[11px] text-neutral-100 hover:bg-neutral-900">
                    Send test
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "payments" && (
        <div className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 text-[11px] text-neutral-200">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Payment settings
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[11px] text-neutral-400">
                Supported payment methods
              </label>
              <div className="space-y-1">
                {["Credit card", "Bank transfer", "Cash", "PayPal"].map((method) => (
                  <label key={method} className="flex items-center gap-2">
                    <input disabled type="checkbox" className="h-3 w-3 rounded" />
                    <span>{method}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] text-neutral-400">
                Commission structure
              </label>
              <select
                disabled
                className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              >
                <option value="percent">Per booking percentage</option>
                <option value="fixed">Fixed per booking</option>
              </select>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[11px] text-neutral-400">Auto-payouts</label>
              <select
                disabled
                className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              >
                <option value="manual">Manual payouts</option>
                <option value="weekly">Weekly auto-payouts</option>
                <option value="monthly">Monthly auto-payouts</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] text-neutral-400">Tax rate (%)</label>
              <input
                disabled
                placeholder="e.g. 10"
                className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-[11px] text-neutral-400">
              Invoice settings
            </label>
            <textarea
              disabled
              rows={3}
              placeholder="Company registration, tax ID, legal wording."
              className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-[11px] text-neutral-100 outline-none"
            />
          </div>
        </div>
      )}

      {activeTab === "integrations" && (
        <div className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 text-[11px] text-neutral-200">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Integrations
          </p>
          <div className="space-y-2">
            <IntegrationRow name="Google Analytics" description="GA4 measurement ID." />
            <IntegrationRow name="Facebook Pixel" description="Meta pixel ID." />
            <IntegrationRow name="Zapier" description="Webhook URL for automation." />
          </div>
          <div className="mt-2 grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[11px] text-neutral-400">
                GA4 measurement ID
              </label>
              <input
                disabled
                placeholder="G-XXXXXXXXXX"
                className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] text-neutral-400">
                Facebook Pixel ID
              </label>
              <input
                disabled
                placeholder="1234567890"
                className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-[11px] text-neutral-400">
              Zapier webhook URL
            </label>
            <input
              disabled
              placeholder="https://hooks.zapier.com/hooks/catch/..."
              className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
            />
          </div>
          <div className="mt-4 space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3">
            <p className="text-[11px] font-semibold text-neutral-200">API keys</p>
            <p className="text-[11px] text-neutral-400">
              Wire this section to a secure API key management system that can generate and
              revoke tenant-specific keys.
            </p>
          </div>
        </div>
      )}

      {activeTab === "danger" && (
        <div className="space-y-3 rounded-2xl border border-red-900 bg-red-950/40 p-4 text-[11px] text-red-100">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
            Danger zone
          </p>
          <div className="space-y-2 rounded-2xl border border-red-900/80 bg-red-950/60 p-3">
            <p className="text-[11px] font-semibold text-red-100">Export all data</p>
            <p className="text-[11px] text-red-200/80">
              Wire this action to a backend job that exports all tenant data as a JSON
              backup and provides a secure download link.
            </p>
            <button className="mt-1 inline-flex rounded-full border border-red-500/60 bg-red-500/10 px-3 py-1.5 text-[11px] font-semibold text-red-100 hover:bg-red-500/20">
              Export JSON backup
            </button>
          </div>
          <div className="space-y-2 rounded-2xl border border-red-900/80 bg-red-950/60 p-3">
            <p className="text-[11px] font-semibold text-red-100">Clear test data</p>
            <p className="text-[11px] text-red-200/80">
              Intended for demo tenants. Wire to a job that deletes demo bookings,
              customers, and tours while keeping core configuration.
            </p>
            <button className="mt-1 inline-flex rounded-full border border-red-500/60 bg-red-500/10 px-3 py-1.5 text-[11px] font-semibold text-red-100 hover:bg-red-500/20">
              Clear test data
            </button>
          </div>
          <div className="space-y-2 rounded-2xl border border-red-900/80 bg-red-950/60 p-3">
            <p className="text-[11px] font-semibold text-red-100">Delete account</p>
            <p className="text-[11px] text-red-200/80">
              This action is irreversible. Require the user to type the company name to
              confirm deletion and wire to an asynchronous tenant deletion workflow.
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <input
                disabled
                placeholder={tenant.name}
                className="h-8 flex-1 rounded-full border border-red-700 bg-red-950 px-3 text-[11px] text-red-100 outline-none"
              />
              <button className="inline-flex rounded-full border border-red-500/60 bg-red-500 px-3 py-1.5 text-[11px] font-semibold text-red-50 hover:bg-red-400">
                Delete workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

type SettingsTabButtonProps = {
  id: SettingsTabId;
  label: string;
  active: boolean;
  onClick: (id: SettingsTabId) => void;
};

function SettingsTabButton(props: SettingsTabButtonProps) {
  const {id, label, active, onClick} = props;

  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`rounded-full border px-3 py-1.5 text-[11px] ${
        active
          ? "border-neutral-100 bg-neutral-100 text-neutral-900"
          : "border-neutral-700 bg-neutral-950 text-neutral-300"
      }`}
    >
      {label}
    </button>
  );
}

type IntegrationRowProps = {
  name: string;
  description: string;
};

function IntegrationRow(props: IntegrationRowProps) {
  const {name, description} = props;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-950/70 px-3 py-2">
      <div>
        <p className="text-[11px] font-semibold text-neutral-100">{name}</p>
        <p className="text-[11px] text-neutral-500">{description}</p>
      </div>
      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
        Not connected
      </span>
    </div>
  );
}
