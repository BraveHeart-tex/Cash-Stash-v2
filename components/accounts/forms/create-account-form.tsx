"use client";
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
import { registerBankAccount } from "@/actions";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import { useRouter } from "next/navigation";
import { generateReadbleEnumLabels } from "@/lib/utils";
import { AccountCategory } from "@prisma/client";

const CreateAccountForm = () => {
  const dispatch = useAppDispatch();
  let [isPending, startTransition] = useTransition();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<AccountSchemaType>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      balance: 0,
    },
  });

  const onSubmit = async (data: AccountSchemaType) => {
    startTransition(async () => {
      const result = await registerBankAccount(data);

      if (result.fieldErrors.length) {
        result.fieldErrors.forEach((fieldError) => {
          setError(fieldError.field as any, {
            type: "manual",
            message: fieldError.message,
          });
        });
      }

      if (result?.error) {
        showErrorToast("An error occurred.", result.error);
      } else {
        router.refresh();
        showSuccessToast("Account created.", "Your account has been created.");
        dispatch(closeGenericModal());
      }
    });
  };

  const selectOptions = generateReadbleEnumLabels({
    enumObj: AccountCategory,
  });

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
          defaultValue={"CHECKING"}
          selectOptions={selectOptions}
          defaultLabel={"Account Type"}
          nameParam={"category"}
          label={"Account Type"}
          placeholder={"Select your account type"}
          register={register}
          errors={errors}
          onChange={(value) => {
            value && setValue("category", value as AccountCategory);
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
