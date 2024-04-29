import GenericModal from "@/components/generic-modal";
import Navbar from "@/components/navbar";
import NavigationTabs from "@/components/navigation-tabs";
import GenericConfirmDialog from "@/components/ui/generic-confirm-dialog";
import { getUser } from "@/lib/auth/session";
import { getTranslations } from "next-intl/server";
import React from "react";

const DashboardMainLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = await getUser();
  const t = await getTranslations("GenericConfirmDialog");

  return (
    <main>
      <Navbar user={user} />
      <NavigationTabs />
      <GenericModal />
      <GenericConfirmDialog
        internationalizationConfig={{
          defaultSecondaryActionLabel: t("defaultSecondaryActionLabel"),
        }}
      />
      {children}
    </main>
  );
};

export default DashboardMainLayout;
