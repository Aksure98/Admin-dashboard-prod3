import type { Metadata } from "next";
import { Figtree, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ReactQueryClientProvider } from "@/utils/ReactQueryProvider";
import Toaster from "@/components/toast";
import ReduxProvider from "@/components/providers/ReduxProvider";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Point2",
    template: "%s | Point2",
  },
  description: "Your one stop logistics platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${figtree.variable}, ${jakarta.variable}  antialiased`}
        suppressHydrationWarning
      >
        <ReduxProvider>
          <ReactQueryClientProvider>
            {children}

            <Toaster />
          </ReactQueryClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
