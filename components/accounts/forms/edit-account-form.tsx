"use client";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import ACCOUNT_OPTIONS, {
  getOptionLabel,
} from "@/lib/CreateUserAccountOptions";
import FormLoadingSpinner from "../../form-loading-spinner";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchCurrentAccount } from "@/app/redux/features/currentAccountSlice";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import {
  showDefaultToast,
  showErrorToast,
  showSuccessToast,
} from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAccountById } from "@/actions";
import accountSchema, {
  AccountSchemaType,
} from "@/schemas/CreateUserAccountSchema";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import { useRouter } from "next/navigation";
import { generateReadbleEnumLabels } from "@/lib/utils";
import { AccountCategory } from "@prisma/client";

interface IEditAccountFormProps {
  entityId: string | null;
}

const EditAccountForm = ({ entityId }: IEditAccountFormProps) => {
  const { currentAccount, isLoading: isCurrentAccountLoading } = useAppSelector(
    (state) => state.currentAccountReducer
  );
  const router = useRouter();

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    setValue,
    getValues,
  } = useForm<AccountSchemaType>({
    resolver: zodResolver(accountSchema),
  });

  let [isPending, startTransition] = useTransition();

  const loading = isCurrentAccountLoading || isLoading;

  useEffect(() => {
    if (entityId) {
      dispatch(fetchCurrentAccount(entityId));
    }
  }, [dispatch, entityId]);

  useEffect(() => {
    if (currentAccount) {
      setValue("name", currentAccount.name);
      setValue("category", currentAccount.category);
      setValue("balance", currentAccount.balance);
    }
  }, [currentAccount, setValue]);

  const onSubmit = async (data: AccountSchemaType) => {
    if (hasMadeNoChanges()) {
      return showDefaultToast(
        "No changes made.",
        "You haven't made any changes."
      );
    }

    startTransition(async () => {
      const result = await updateAccountById({
        accountId: entityId,
        ...data,
      });

      if (result?.error) {
        showErrorToast("An error occurred.", result.error);
      } else {
        router.refresh();
        showSuccessToast("Account updated.", "Your account has been updated.");
        dispatch(closeGenericModal());
      }
    });
  };

  if (loading) {
    return <FormLoadingSpinner />;
  }

  const hasMadeNoChanges = () => {
    const { name, category, balance } = getValues();
    if (!currentAccount) {
      return true;
    }

    return (
      name === currentAccount.name &&
      category === currentAccount.category &&
      balance === currentAccount.balance
    );
  };

  const selectOptions = generateReadbleEnumLabels({ enumObj: AccountCategory });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4">
        <FormInput
          name={"name"}
          label={"Account Name"}
          placeholder={"Account name"}
          type={"text"}
          register={register}
          errors={errors}
        />
        <FormSelect
          selectOptions={selectOptions}
          nameParam={"category"}
          label={"Account Type"}
          placeholder={"Select your account type"}
          register={register}
          errors={errors}
          onChange={(value) => {
            setValue("category", value as AccountCategory);
          }}
        />
        <FormInput
          name={"balance"}
          label={"Account Balance $"}
          placeholder={"Balance ($)"}
          type={"number"}
          step={"0.01"}
          register={register}
          errors={errors}
        />
        {isPending ? (
          <Button disabled={isPending}>Loading...</Button>
        ) : (
          <Button type="submit" disabled={isSubmitting || isPending}>
            Update Account
          </Button>
        )}
      </div>
    </form>
  );
};

export default EditAccountForm;
