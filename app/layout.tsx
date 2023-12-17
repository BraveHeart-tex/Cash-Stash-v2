import "./globals.css";
import { Inter } from "next/font/google";
import { Providers as ReduxProviders } from "@/app/redux/provider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import GenericConfirmDialog from "@/components/GenericConfirmDialog";
import GenericModal from "@/components/GenericModal";
import Navigation from "./components/Navigation";
import { getCurrentUserAction } from "@/actions";
import NavigationTabs from "@/components/NavigationTabs";
import MobileTabsList from "@/components/MobileTabsList";

const InterFont = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Cash Stash | Personal Finance",
  description:
    "Minimalist personal finance app. Track your spending, set a budget, and save more.",
};

interface ILayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: ILayoutProps) {
  const { user } = await getCurrentUserAction();

  return (
    <html lang="en">
      <body className={InterFont.className}>
        <ReduxProviders>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {user ? <Navigation /> : null}
            <NavigationTabs />
            {children}
            <GenericModal />
            <GenericConfirmDialog />
          </ThemeProvider>
          <Toaster />
        </ReduxProviders>
      </body>
    </html>
  );
}
