import type { Metadata } from "next";
// Supports weights 100-900
import '@fontsource-variable/montserrat';
import "./globals.css";
import { Toast } from "@/module/common/components/toast";
import { LayoutClient } from "./layoutClient";
import { createClient } from "@/supabase/server";
import { siteUrl } from "@/constant/seo";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Math Library | Biblioteca matemática",
    template: "%s | Math Library",
  },
  description:
    "Explora funciones, ecuaciones e identidades matemáticas con explicaciones claras en español, inglés y japonés.",
  applicationName: "Math Library",
  category: "education",
  keywords: [
    "matemáticas",
    "funciones",
    "ecuaciones",
    "álgebra",
    "trigonometría",
    "mathematics",
    "数学",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: ["en_US", "ja_JP"],
    siteName: "Math Library",
    title: "Math Library | Biblioteca matemática",
    description:
      "Explora funciones, ecuaciones e identidades matemáticas en tres idiomas.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Math Library | Biblioteca matemática",
    description:
      "Explora funciones, ecuaciones e identidades matemáticas en tres idiomas.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const client = await createClient()

  const user = await client.auth.getUser()

  return (
    <html data-theme="syntactic-canvas" lang="es">
      <body
        className="bg-base-100"

      >
        <LayoutClient
          user={user.data.user}
        >
          <Toast />
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
