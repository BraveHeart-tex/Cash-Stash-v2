import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import GenericModal from "@/components/generic-modal";
import NavigationTabs from "@/components/navigation-tabs";
import { Metadata } from "next";
import Navbar from "@/components/navbar";
import { getUser } from "@/lib/auth/session";
import GenericConfirmDialog from "./generic-confirm-dialog";
import RedirectionPathToaster from "@/components/redirection-path-toaster";
import UriBarcodeDialog from "@/components/uri-barcode-dialog";
import { ReactNode } from "react";
import SonnerToaster from "@/components/ui/sonner";

const InterFont = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const APP_NAME = "Cash Stash";
const APP_DEFAULT_TITLE = "Cash Stash | Personal Finance";
const APP_TITLE_TEMPLATE = "%s - Cash Stash";
const APP_DESCRIPTION =
  "Minimalist personal finance app. Track your spending, set a budget, and save more.";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  applicationName: APP_NAME,
  metadataBase: new URL("https://cashstash.borakaraca.tech"),
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

interface ILayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: ILayoutProps) {
  const { user } = await getUser();

  return (
    <html lang="en">
      <body className={InterFont.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar user={user} />
          <NavigationTabs />
          {/* Padding bottom is the same as the height of the navigation bar */}
          <main className="pb-16 lg:pb-0">{children}</main>
          <GenericModal />
          <UriBarcodeDialog />
          <GenericConfirmDialog />
          <RedirectionPathToaster />
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
