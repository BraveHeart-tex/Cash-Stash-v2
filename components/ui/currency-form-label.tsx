import useAuthStore from "@/store/auth/authStore";
import { FormLabel } from "@/components/ui/form";

type ICurrencyFormLabelProps = React.ComponentPropsWithoutRef<"label"> & {
  label: string;
};

const CurrencyFormLabel = ({ label, ...props }: ICurrencyFormLabelProps) => {
  const preferredCurrency = useAuthStore(
    (state) => state.user?.preferredCurrency
  );

  return (
    <FormLabel {...props}>
      {label} ({preferredCurrency})
    </FormLabel>
  );
};

export default CurrencyFormLabel;
