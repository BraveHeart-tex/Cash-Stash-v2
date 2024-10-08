import AutoProgressInput from "@/components/auto-progress-input";
import { Label } from "@/components/ui/label";
import { activateTwoFactorAuthentication } from "@/server/auth";
import useAuthStore from "@/store/auth/authStore";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

type TwoFactorAuthenticationActivationInputProps = {
  label: string;
};

const TwoFactorAuthenticationActivationInput = ({
  label,
}: TwoFactorAuthenticationActivationInputProps) => {
  const [code, setCode] = useState("");
  const [isPending, startTransition] = useTransition();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (code.length === 6 && user) {
      startTransition(async () => {
        const response = await activateTwoFactorAuthentication(code);

        if (response.error) {
          toast.error(response.error);
        }

        if (response.successMessage) {
          toast.success(response.successMessage);
          setUser({
            activatedTwoFactorAuthentication: true,
            prefersTwoFactorAuthentication: true,
          });
        }
      });
    }
  }, [code, setUser, user]);

  return (
    <div>
      <Label>{label}</Label>
      <AutoProgressInput loading={isPending} length={6} onChange={setCode} />
    </div>
  );
};

export default TwoFactorAuthenticationActivationInput;
