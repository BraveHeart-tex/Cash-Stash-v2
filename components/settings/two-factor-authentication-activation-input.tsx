import { useEffect, useState, useTransition } from "react";
import AutoProgressInput from "@/components/auto-progress-input";
import { Label } from "@/components/ui/label";
import { activateTwoFactorAuthentication } from "@/actions/auth";
import { toast } from "sonner";
import useAuthStore from "@/store/auth/authStore";

const TwoFactorAuthenticationActivationInput = () => {
  const [code, setCode] = useState("");
  let [isPending, startTransition] = useTransition();
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
      <Label>Code</Label>
      <AutoProgressInput loading={isPending} length={6} onChange={setCode} />
    </div>
  );
};

export default TwoFactorAuthenticationActivationInput;
