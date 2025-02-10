export { default } from 'next-auth/middleware'

export const config = {
  pages: {
    signIn: '/signIn/'
  },
  matcher: ['/myrac/:path*']
}
