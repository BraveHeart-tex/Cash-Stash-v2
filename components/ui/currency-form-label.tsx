import useAuthStore from "@/store/auth/authStore";
import { FormLabel } from "./form";

interface ICurrencyFormLabelProps
  extends React.ComponentPropsWithoutRef<"label"> {
  label: string;
}

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
