import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {ClerkProvider} from '@clerk/nextjs'
import { ThemeProvider } from "@/app/ThemeProvider";

const APP_NAME = "NoteAI";
const APP_DEFAULT_TITLE = "Un app di note intelligente";
const APP_TITLE_TEMPLATE = "%s - NoteAI App";
const APP_DESCRIPTION = "Un app di note intelligente";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE
  },
  icons:{
    apple: '/assets/logo.png',
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp:{
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE
  },
  formatDetection:{
    telephone: false,
  },
  openGraph:{
    type: "website",
    siteName: APP_NAME,
    title:{
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION
  },
  twitter:{
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  }
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider attribute="class">
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
