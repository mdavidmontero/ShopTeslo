import type { Metadata } from "next";
import "./globals.css";
import { inter } from "../config/fonts";
import { Providers } from "@/components";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Tesloshop",
  description: "Una tienda virtual de Productos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
