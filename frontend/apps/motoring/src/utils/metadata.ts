export function getPageTitle(suffix?: string): string {
  const baseTitle = "Roadside Assistance - Update your vehicle";
  return suffix ? `${baseTitle} - ${suffix}` : baseTitle;
}
