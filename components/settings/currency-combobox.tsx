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
  internationalizationConfig: {
    convertCurrencyDialogTitle: string;
    convertCurrencyDialogDescription: string;
    convertCurrencyPrimaryActionLabel: string;
    convertCurrencySecondaryActionLabel: string;
    convertCurrencyPending: string;
    convertCurrencySuccessMessage: string;
    currencySaveRejectMessage: string;
    currencySaveSuccessMessage: string;
    changeCurrencyDialogTitle: string;
    changeCurrencyDialogMessage: string;
    changeCurrencyPending: string;
    changeCurrencySuccessMessage: string;
    changeCurrencyPrimaryActionLabel: string;
    changeCurrencySaveLabel: string;
  };
};

const CurrencyCombobox = ({
  currencies,
  internationalizationConfig,
}: CurrencyComboboxProps) => {
  const {
    convertCurrencyDialogTitle,
    convertCurrencyDialogDescription,
    convertCurrencyPrimaryActionLabel,
    convertCurrencySecondaryActionLabel,
    convertCurrencyPending,
    convertCurrencySuccessMessage,
    currencySaveRejectMessage,
    currencySaveSuccessMessage,
    changeCurrencyDialogTitle,
    changeCurrencyDialogMessage,
    changeCurrencyPending,
    changeCurrencySuccessMessage,
    changeCurrencyPrimaryActionLabel,
    changeCurrencySaveLabel,
  } = internationalizationConfig;

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
      title: convertCurrencyDialogTitle,
      message: convertCurrencyDialogDescription,
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
          loading: convertCurrencyPending,
          success: convertCurrencySuccessMessage,
          error(error) {
            return error;
          },
        });
      },
      primaryActionLabel: convertCurrencyPrimaryActionLabel,
      secondaryActionLabel: convertCurrencySecondaryActionLabel,
    });
  };

  const handleCurrencySaveConfirm = () => {
    return new Promise(async (resolve, reject) => {
      if (!selectedCurrency) {
        reject(currencySaveRejectMessage);
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

        resolve(currencySaveSuccessMessage);

        setTimeout(() => {
          askCurrencyConversion(oldSymbol, selectedCurrency);
        }, 100);
      });
    });
  };

  const handleCurrencySave = () => {
    if (!selectedCurrency) return;
    showGenericConfirm({
      title: changeCurrencyDialogTitle,
      message: changeCurrencyDialogMessage
        .replace("_fromLabel", String(userSelectedCurrency?.label))
        .replace("_toLabel", String(selectedCurrency.label)),
      onConfirm() {
        toast.promise(handleCurrencySaveConfirm, {
          loading: changeCurrencyPending,
          success: changeCurrencySuccessMessage,
          error(error) {
            return error;
          },
        });
      },
      primaryActionLabel: changeCurrencyPrimaryActionLabel,
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
            {isPending ? changeCurrencyPending : changeCurrencySaveLabel}
          </Button>
        )}
    </div>
  );
};
export default CurrencyCombobox;
