import "./globals.css";
import { Inter } from "next/font/google";
import { Providers as ReduxProviders } from "@/app/redux/provider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import GenericConfirmDialog from "@/components/generic-confirm-dialog";
import GenericModal from "@/components/generic-modal";
import { getUserSession } from "@/actions/auth";
import NavigationTabs from "@/components/navigation-tabs";
import { Metadata, Viewport } from "next";
import Navbar from "@/components/navbar";

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

export const viewport: Viewport = {
  themeColor: "#e11d48",
};

interface ILayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: ILayoutProps) {
  const { user } = await getUserSession();

  return (
    <html lang="en">
      <body className={InterFont.className}>
        <ReduxProviders>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {user ? <Navbar /> : null}
            <NavigationTabs />
            {/* Padding bottom is the same as the height of the navigation bar */}
            <main className="pb-16 lg:pb-0">{children}</main>
            <GenericModal />
            <GenericConfirmDialog />
          </ThemeProvider>
          <Toaster />
        </ReduxProviders>
      </body>
    </html>
  );
}
