"use client";
import { IComboboxOption } from "@/actions/types";
import Combobox from "@/components/ui/combobox";
import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import useAuthStore from "@/store/auth/authStore";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import { toast } from "sonner";
import {
  convertTransactionsToNewCurrency,
  updateUserCurrencyPreference,
} from "@/actions/user";

const CurrencyCombobox = ({
  currencies,
}: {
  currencies: IComboboxOption[];
}) => {
  let [isPending, startTransition] = useTransition();
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
  );

  const handleCurrencySave = () => {
    if (!selectedCurrency) return;
    showGenericConfirm({
      title: "Are you sure you want to change your preferred currency?",
      message: `You will be changing your preferred currency from: ${userSelectedCurrency?.label} to: ${selectedCurrency.label}.`,
      onConfirm() {
        startTransition(async () => {
          const oldSymbol = userSelectedCurrency?.value!;
          const response = await updateUserCurrencyPreference(
            selectedCurrency.value
          );
          if (response?.error) {
            toast.error(response.error);
            return;
          }

          toast.success("Preferred currency changed successfully");
          setUser({
            preferredCurrency: selectedCurrency.value,
          });

          setTimeout(() => {
            showGenericConfirm({
              title: "Would you like to convert your transactions?",
              message:
                "Your preferred currency has been updated. If you'd like, your transactions can be converted to your new currency. This process may take a few seconds.",
              onConfirm() {
                startTransition(async () => {
                  const response = await convertTransactionsToNewCurrency(
                    oldSymbol,
                    selectedCurrency.value
                  );

                  if (response?.error) {
                    toast.error(response.error);
                    return;
                  }

                  toast.success(response?.success);
                });
              },
              primaryActionLabel: "Convert",
              secondaryActionLabel: "Don't Convert",
            });
          }, 100);
        });
      },
      primaryActionLabel: "Confirm",
    });
  };

  if (!userSelectedCurrency) return null;

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
          <Button
            disabled={isPending}
            className="w-max"
            onClick={handleCurrencySave}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        )}
    </div>
  );
};
export default CurrencyCombobox;
