export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/roadside-assistance/update-your-vehicle/:path*"],
};
