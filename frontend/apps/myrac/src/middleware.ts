export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/myrac", "/myrac(/(?!_next|favicon.ico).*)"],
};
