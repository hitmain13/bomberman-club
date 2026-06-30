import type { Metadata, Viewport } from "next";

import { Providers } from "@/shared/contexts/providers";

import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Bomberman Club",
  description: "Rede social automotiva para entusiastas — perfis, garagem e flagrados.",
  applicationName: "Bomberman Club",
  manifest: undefined,
};

export const viewport: Viewport = {
  themeColor: "#0b0b0f",
  initialScale: 1,
  width: "device-width",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
