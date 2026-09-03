export type AnalyticsEventName =
  | "page_view"
  | "catalog_search"
  | "product_view"
  | "filter_applied"
  | "spec_sheet_download"
  | "configurator_start"
  | "configurator_step"
  | "configurator_abandon"
  | "quote_submit"
  | "contact_submit"
  | "phone_click"
  | "email_click"
  | "careers_apply_click"
  | "portal_click"
  | "employee_signin"
  | "employee_tool_open";

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  params: Record<string, string | number | boolean | null | undefined>;
  timestamp: string;
  conversion: boolean;
};
