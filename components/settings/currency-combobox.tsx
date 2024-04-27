"use client";
import Combobox, { ComboboxOption } from "@/components/ui/combobox";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/auth/authStore";
import { useGenericConfirmStore } from "@/store/genericConfirmStore";
import { toast } from "sonner";
import {
  convertTransactionsToNewCurrency,
  updateUserCurrencyPreference,
} from "@/server/user";

type CurrencyComboboxProps = {
  currencies: ComboboxOption[];
};

const CurrencyCombobox = ({ currencies }: CurrencyComboboxProps) => {
  let [isPending, startTransition] = useTransition();
  const [selectedCurrency, setSelectedCurrency] =
    useState<ComboboxOption | null>(null);

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

  const askCurrencyConversion = (
    oldSymbol: string,
    selectedCurrency: ComboboxOption
  ) => {
    showGenericConfirm({
      title: "Would you like to convert your transactions?",
      message:
        "Your preferred currency has been updated. If you'd like, your transactions can be converted to your new currency. This process may take a few seconds.",
      onConfirm() {
        const updateCurrencyConversion = () => {
          return new Promise(async (resolve, reject) => {
            startTransition(async () => {
              const response = await convertTransactionsToNewCurrency(
                oldSymbol,
                selectedCurrency.value
              );

              if (response?.error) {
                reject(response.error);
                return;
              }

              resolve(response?.success);
            });
          });
        };
        toast.promise(updateCurrencyConversion, {
          loading: "Converting...",
          success:
            "Successfully converted transactions to the new currency rate.",
          error(error) {
            return error;
          },
        });
      },
      primaryActionLabel: "Convert",
      secondaryActionLabel: "Don't Convert",
    });
  };

  const handleCurrencySaveConfirm = () => {
    return new Promise(async (resolve, reject) => {
      if (!selectedCurrency) {
        reject("No currency selected");
        return;
      }

      startTransition(async () => {
        const oldSymbol = userSelectedCurrency?.value!;
        const response = await updateUserCurrencyPreference(
          selectedCurrency.value
        );

        if (response?.error) {
          toast.error(response.error);
          reject(response.error);
          return;
        }

        setUser({
          preferredCurrency: selectedCurrency.value,
        });

        resolve("Preferred currency changed successfully");

        setTimeout(() => {
          askCurrencyConversion(oldSymbol, selectedCurrency);
        }, 100);
      });
    });
  };

  const handleCurrencySave = () => {
    if (!selectedCurrency) return;
    showGenericConfirm({
      title: "Are you sure you want to change your preferred currency?",
      message: `You will be changing your preferred currency from: ${userSelectedCurrency?.label} to: ${selectedCurrency.label}.`,
      onConfirm() {
        toast.promise(handleCurrencySaveConfirm, {
          loading: "Saving...",
          success: "Preferred currency changed successfully",
          error(error) {
            return error;
          },
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
