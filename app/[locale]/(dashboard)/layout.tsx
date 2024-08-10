import GenericModal from "@/components/generic-modal";
import Navbar from "@/components/navbar";
import NavigationTabs from "@/components/navigation-tabs";
import GenericConfirmDialog from "@/components/ui/generic-confirm-dialog";
import { getUser } from "@/lib/auth/session";
import { getTranslations } from "next-intl/server";
import type React from "react";

const DashboardMainLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = await getUser();
  const t = await getTranslations("Generic");

  return (
    <main>
      <Navbar user={user} />
      <NavigationTabs />
      <GenericModal cancelLabel={t("GenericContentModal.dialogCancelLabel")} />
      <GenericConfirmDialog
        internationalizationConfig={{
          defaultSecondaryActionLabel: t(
            "GenericConfirmDialog.defaultSecondaryActionLabel",
          ),
        }}
      />
      {children}
    </main>
  );
};

export default DashboardMainLayout;
