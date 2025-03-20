export function getPageTitle(pageName?: string): string {
  const baseTitle = "myRAC registration";
  return pageName ? `${pageName} | ${baseTitle}` : baseTitle;
}
