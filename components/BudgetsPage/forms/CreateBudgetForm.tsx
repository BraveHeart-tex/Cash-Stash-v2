"use client";
import CreateBudgetOptions from "@/lib/CreateBudgetOptions";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/app/redux/hooks";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import CreateBudgetSchema, {
  CreateBudgetSchemaType,
} from "@/schemas/CreateBudgetSchema";
import { createBudgetAction } from "@/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const CreateBudgetForm = () => {
  let [isPending, startTransition] = useTransition();
  const budgetOptions = Object.values(CreateBudgetOptions);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateBudgetSchemaType>({
    resolver: zodResolver(CreateBudgetSchema),
  });

  const onSubmit = async (data: CreateBudgetSchemaType) => {
    startTransition(async () => {
      const result = await createBudgetAction(data);

      if (result?.error) {
        showErrorToast("An error occurred.", result.error);
      } else {
        router.refresh();
        const category =
          result.budget && result.budget.category
            ? CreateBudgetOptions[result.budget.category]
            : "";
        showSuccessToast(
          "Budget created.",
          `Budget for ${category} has been created.`
        );
        dispatch(closeGenericModal());
      }
    });
  };

  const BudgetSelectOptions = budgetOptions.map((option) => ({
    label: option,
    value: option,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4">
        <FormInput
          name={"name"}
          label={"Budget Name"}
          placeholder={"Give your budget a name"}
          type={"text"}
          register={register}
          errors={errors}
        />
        <FormInput
          name={"budgetAmount"}
          label={"Budget Amount"}
          placeholder={"Budget Amount"}
          type={"number"}
          register={register}
          errors={errors}
        />
        <FormSelect
          defaultValue={BudgetSelectOptions[0].value}
          selectOptions={BudgetSelectOptions}
          nameParam={"category"}
          label={"Budget Category"}
          placeholder={""}
          register={register}
          errors={errors}
          onChange={(value) => {
            setValue("category", value);
          }}
        />
        <FormInput
          name={"spentAmount"}
          label={"Budget Spent ($)"}
          placeholder={"Budget Spent ($)"}
          step={"0.01"}
          type={"number"}
          register={register}
          errors={errors}
        />
        <Button type="submit" disabled={isSubmitting || isPending}>
          Create
        </Button>
      </div>
    </form>
  );
};

export default CreateBudgetForm;
