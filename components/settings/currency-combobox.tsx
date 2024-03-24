"use client";
import { IComboboxOption } from "@/actions/types";
import Combobox from "@/components/ui/combobox";
import { useState } from "react";
import { Button } from "../ui/button";
import useAuthStore from "@/store/auth/authStore";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import { toast } from "sonner";

const CurrencyCombobox = ({
  currencies,
}: {
  currencies: IComboboxOption[];
  userSelectedCurrency: IComboboxOption | undefined;
}) => {
  const [selectedCurrency, setSelectedCurrency] =
    useState<IComboboxOption | null>(null);
  const setUser = useAuthStore((state) => state.setUser);
  const showGenericConfirm = useGenericConfirmStore(
    (state) => state.showConfirm
  );
  const userPreferredCurrency = useAuthStore(
    (state) => state.user?.preferredCurrency
  );
  const userSelectedCurrency = currencies.find(
    (item) => item.value === userPreferredCurrency
  ) || {
    label: "United States Dollar (USD)",
    value: "USD",
  };

  const handleCurrencySave = () => {
    if (!selectedCurrency) return;
    showGenericConfirm({
      title: "Are you sure you want to change your preferred currency?",
      message: `You will be changing your preferred currency from: ${userSelectedCurrency?.label} to: ${selectedCurrency.label}.`,
      onConfirm() {
        // TODO: do db stuff

        toast.success("Preferred currency changed successfully");
        setUser({
          preferredCurrency: selectedCurrency.value,
        });
      },
      primaryActionLabel: "Confirm",
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Combobox
        triggerClassName="w-full md:w-[400px] whitespace-nowrap"
        options={currencies}
        defaultOption={userSelectedCurrency}
        onSelect={(value) => {
          setSelectedCurrency(value);
        }}
      />
      {selectedCurrency &&
        selectedCurrency.value !== userSelectedCurrency.value && (
          <Button className="w-max" onClick={handleCurrencySave}>
            Save Changes
          </Button>
        )}
    </div>
  );
};
export default CurrencyCombobox;
