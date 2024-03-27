import GenericModal from "@/components/generic-modal";
import Navbar from "@/components/navbar";
import NavigationTabs from "@/components/navigation-tabs";
import GenericConfirmDialog from "@/components/ui/generic-confirm-dialog";
import { getUser } from "@/lib/auth/session";
import React from "react";

const DashboardMainLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = await getUser();

  return (
    <main>
      <Navbar user={user} />
      <NavigationTabs />
      <GenericModal />
      <GenericConfirmDialog />
      {children}
    </main>
  );
};

export default DashboardMainLayout;
