import { Providers } from "#components/Providers";

export default function ErrorLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Providers session={null}>
        <body>{children}</body>
      </Providers>
    </html>
  );
}
