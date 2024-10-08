import type { Metadata } from "next";
import {Bakbak_One} from "next/font/google"
import "./globals.css";
import AppProviders from "@/components/AppProviders";

export const metadata: Metadata = {
  title: "Journez AI Tool",
  description: "Journez AI Tool",
};

const bakbak_one = Bakbak_One({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bakbak_one.className} antialiased text-[16px]`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
