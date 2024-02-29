"use client";

import { Button } from "@/components/ui/button";
import { MdPhonelinkSetup } from "react-icons/md";

const UserSettings = () => {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-foreground text-lg">
          2-Factor Authentication
        </h2>
        <p className="text-muted-foreground text-sm">
          You can Enable 2FA to add an extra layer of security to your account.
        </p>
        <Button className="w-max mt-2">
          <MdPhonelinkSetup className="mr-2" />
          Enable 2FA
        </Button>
      </div>
    </div>
  );
};

export default UserSettings;
