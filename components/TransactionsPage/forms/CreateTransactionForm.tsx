"use client";
import { useAppDispatch } from "@/app/redux/hooks";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import CreateBudgetOptions from "@/lib/CreateBudgetOptions";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import CreateTransactionSchema, {
  CreateTransactionSchemaType,
} from "@/schemas/CreateTransactionSchema";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import FormInput from "@/components/FormInput";
import FormSelect, { SelectOption } from "@/components/FormSelect";
import { Button } from "@/components/ui/button";
import { createTransactionAction } from "@/actions";
import { useRouter } from "next/navigation";
import { SerializedUserAccount } from "@/app/redux/features/userAccountSlice";

const CreateTransactionForm = ({
  userAccounts,
}: {
  userAccounts: SerializedUserAccount[];
}) => {
  let [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateTransactionSchemaType>({
    defaultValues: {
      amount: 0,
      description: "",
      category: "Food",
      accountId: "",
      isIncome: true,
    },
    resolver: zodResolver(CreateTransactionSchema),
  });

  const onSubmit = async (data: CreateTransactionSchemaType) => {
    startTransition(async () => {
      const result = await createTransactionAction(data);
      if (result?.error) {
        showErrorToast("An error occurred.", result.error);
      } else {
        router.refresh();
        showSuccessToast(
          "Transaction created.",
          `Transaction for ${result?.transaction?.amount}₺ created.`
        );
        dispatch(closeGenericModal());
      }
    });
  };

  const categorySelectOptions = Object.values(CreateBudgetOptions).map(
    (category) => ({
      value: category,
      label: category,
    })
  );

  const userAccountSelectOptions = userAccounts?.map((acc) => ({
    value: acc.id.toString(),
    label: acc.name,
  })) as SelectOption[];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4">
        {/* @ts-ignore */}
        <FormInput
          name={"amount"}
          label={"Amount (₺)"}
          placeholder={"Amount"}
          type={"number"}
          register={register}
          errors={errors}
        />
        <FormInput
          name={"description"}
          label={"Description"}
          placeholder={"Description"}
          type={"text"}
          register={register}
          errors={errors}
        />
        <FormSelect
          defaultValue={categorySelectOptions[0]?.value}
          selectOptions={categorySelectOptions}
          nameParam={"category"}
          label={"Category"}
          placeholder={"Category"}
          register={register}
          errors={errors}
          onChange={(value) => {
            setValue("category", value);
          }}
        />
        <FormSelect
          defaultValue={userAccountSelectOptions[0]?.value}
          selectOptions={userAccountSelectOptions}
          nameParam={"accountId"}
          label={"Account"}
          placeholder={"Account"}
          register={register}
          errors={errors}
          onChange={(value) => setValue("accountId", value)}
        />
        <FormSelect
          defaultValue={"income"}
          selectOptions={[
            { value: "income", label: "Income" },
            { value: "expense", label: "Expense" },
          ]}
          nameParam={"isIncome"}
          label={"Transaction Type"}
          placeholder={"Transaction Type"}
          register={register}
          errors={errors}
          onChange={(value) => {
            let isIncome: boolean = true;
            if (value === "expense") {
              isIncome = false;
            }
            setValue("isIncome", isIncome);
          }}
        />
        <Button
          className="mt-4"
          type="submit"
          disabled={isPending || isSubmitting}
        >
          Create
        </Button>
      </div>
    </form>
  );
};

export default CreateTransactionForm;
