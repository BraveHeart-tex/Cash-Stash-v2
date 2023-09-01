"use client";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import CreateUserAccountOptions, {
  getOptionLabel,
} from "@/lib/CreateUserAccountOptions";
import FormLoadingSpinner from "../../FormLoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchCurrentAccount } from "@/app/redux/features/currentAccountSlice";
import { fetchCurrentUserAccounts } from "@/app/redux/features/userAccountSlice";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAccountByIdAction } from "@/actions";
import CreateUserAccountSchema, {
  CreateUserAccountSchemaType,
} from "@/schemas/CreateUserAccountSchema";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";

interface IEditUserAccountFormProps {
  entityId: number | null;
}

const EditUserAccountForm = ({ entityId }: IEditUserAccountFormProps) => {
  const { currentAccount, isLoading: isCurrentAccountLoading } = useAppSelector(
    (state) => state.currentAccountReducer
  );

  const dispatch = useAppDispatch();

  const accountOptions = Object.values(CreateUserAccountOptions);

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    setValue,
    getValues,
  } = useForm<CreateUserAccountSchemaType>({
    defaultValues: {
      balance: 10,
      category: "",
      name: "",
    },
    // @ts-ignore
    resolver: zodResolver(CreateUserAccountSchema),
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
      setValue(
        "category",
        getOptionLabel(CreateUserAccountOptions, currentAccount.category)
      );
      setValue("balance", currentAccount.balance);
    }

    return () => {
      setValue("name", "");
      setValue("category", "");
      setValue("balance", 0);
    };
  }, [currentAccount, setValue]);

  const onSubmit = async (data: CreateUserAccountSchemaType) => {
    if (hasMadeNoChanges()) {
      toast({
        title: "No changes made.",
        description: "You have not made any changes.",
        variant: "default",
        duration: 5000,
      });
      return;
    }

    startTransition(async () => {
      const result = await updateAccountByIdAction({
        accountId: entityId,
        ...data,
      });

      if (result.error) {
        toast({
          title: "There was an error while updating your account.",
          description: result.error,
          variant: "destructive",
          duration: 5000,
        });
      } else {
        dispatch(fetchCurrentUserAccounts());
        toast({
          title: "Account updated.",
          description: "Account has been updated successfully.",
          variant: "default",
          duration: 5000,
        });
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
      name === currentAccount?.name &&
      category ===
        getOptionLabel(CreateUserAccountOptions, currentAccount?.category!) &&
      balance === currentAccount?.balance
    );
  };

  const selectOptions = accountOptions.map((option) => ({
    label: option,
    value: option,
  }));

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
          defaultValue={getOptionLabel(
            CreateUserAccountOptions,
            currentAccount?.category!
          )}
          selectOptions={selectOptions}
          nameParam={"category"}
          label={"Account Type"}
          placeholder={"Select your account type"}
          register={register}
          errors={errors}
          onChange={(value) => {
            setValue("category", value);
          }}
        />
        <FormInput
          name={"balance"}
          label={"Account Balance ₺"}
          placeholder={"Balance (₺)"}
          type={"number"}
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

export default EditUserAccountForm;
