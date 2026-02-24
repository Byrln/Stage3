import type {Metadata} from "next";
import {Inter, Plus_Jakarta_Sans} from "next/font/google";
import {Toaster} from "sileo";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { InvertedToaster } from "@/components/ui/inverted-toaster";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const displayFont = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tripsaas",
  description: "Multi-tenant travel SaaS for modern tour operators",
};

export default function RootLayout(props: Readonly<{children: React.ReactNode}>) {
  const {children} = props;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <InvertedToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
