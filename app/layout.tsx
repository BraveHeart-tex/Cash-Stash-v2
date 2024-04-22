import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Metadata } from "next";
import RedirectionPathToaster from "@/components/redirection-path-toaster";
import { ReactNode } from "react";
import SonnerToaster from "@/components/ui/sonner";
import GoogleCaptchaWrapper from "@/components/google-captcha-wrapper";
import { THEME_OPTIONS } from "@/lib/constants";

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

  icons: [
    {
      href: "/apple-touch-icon.png",
      sizes: "180x180",
      rel: "apple-touch-icon",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
      url: "/favicon-16x16.png",
    },
    {
      rel: "mask-icon",
      href: "/safari-pinned-tab.svg",
      color: "#5bbad5",
      url: "/safari-pinned-tab.svg",
    },
  ],
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
  other: {
    "msapplication-TileColor": "#b91d47",
    "msapplication-config": "/browserconfig.xml",
  },
};

type LayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: LayoutProps) {
  const themeValues = THEME_OPTIONS.map((item) => item.value);

  return (
    <html lang="en">
      <head>
        <meta name="msapplication-TileColor" content="#b91d47" />
      </head>
      <body className={InterFont.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          themes={themeValues}
        >
          <GoogleCaptchaWrapper>
            <RedirectionPathToaster />
            <SonnerToaster />
            <main className="pb-16 lg:pb-0">{children}</main>
          </GoogleCaptchaWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
