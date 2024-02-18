"use client";
import ACCOUNT_OPTIONS from "@/lib/CreateUserAccountOptions";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/app/redux/hooks";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import accountSchema, {
  AccountSchemaType,
} from "@/schemas/CreateUserAccountSchema";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { Button } from "@/components/ui/button";
import { registerBankAccountAction } from "@/actions";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import { useRouter } from "next/navigation";

const CreateAccountForm = () => {
  const dispatch = useAppDispatch();
  let [isPending, startTransition] = useTransition();
  const accountOptions = Object.values(ACCOUNT_OPTIONS);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<AccountSchemaType>({
    defaultValues: {
      balance: 10,
      category: "checking",
      name: "",
    },
    resolver: zodResolver(accountSchema),
  });

  const onSubmit = async (data: AccountSchemaType) => {
    startTransition(async () => {
      const result = await registerBankAccountAction(data);

      if (result?.error) {
        showErrorToast("An error occurred.", result.error);
      } else {
        router.refresh();
        showSuccessToast("Account created.", "Your account has been created.");
        dispatch(closeGenericModal());
      }
    });
  };

  const selectOptions = accountOptions.map((option) => ({
    label: option,
    value: option,
  }));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="create-user-account-form"
    >
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
          defaultValue={"Checking Account"}
          selectOptions={selectOptions}
          defaultLabel={"Account Type"}
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
          label={"Account Balance $"}
          placeholder={"Balance ($)"}
          step={"0.01"}
          type={"number"}
          register={register}
          errors={errors}
        />
        {isPending ? (
          <Button disabled={isPending}>Loading...</Button>
        ) : (
          <Button type="submit" disabled={isSubmitting || isPending}>
            Create
          </Button>
        )}
      </div>
    </form>
  );
};

export default CreateAccountForm;
