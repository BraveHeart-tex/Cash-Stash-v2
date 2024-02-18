"use client";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchBudgetById } from "@/app/redux/features/currentBudgetSlice";
import CreateBudgetOptions from "@/lib/CreateBudgetOptions";
import { getOptionLabel } from "@/lib/CreateUserAccountOptions";
import FormLoadingSpinner from "@/components/form-loading-spinner";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import {
  showDefaultToast,
  showErrorToast,
  showSuccessToast,
} from "@/components/ui/use-toast";
import EditBudgetSchema, {
  EditBudgetSchemaType,
} from "@/schemas/EditBudgetSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { Button } from "@/components/ui/button";
import { updateBudget } from "@/actions";
import { useRouter } from "next/navigation";

interface IEditBudgetFormProps {
  entityId: string;
}

const EditUserBudgetForm = ({ entityId }: IEditBudgetFormProps) => {
  let [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const budgetOptions = Object.values(CreateBudgetOptions);
  const { currentBudget, isLoading: isCurrentBudgetLoading } = useAppSelector(
    (state) => state.currentBudgetReducer
  );
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    setValue,
    setError,
    getValues,
  } = useForm<EditBudgetSchemaType>({
    defaultValues: {
      name: "",
      budgetAmount: 0,
      category: "",
      spentAmount: 0,
    },
    resolver: zodResolver(EditBudgetSchema),
  });

  const hasMadeNoChanges = () => {
    const { budgetAmount, category, spentAmount } = getValues();
    return (
      budgetAmount === currentBudget?.budgetAmount &&
      category === CreateBudgetOptions[currentBudget?.category] &&
      spentAmount === currentBudget?.spentAmount
    );
  };

  const loading = isCurrentBudgetLoading || isLoading;

  useEffect(() => {
    if (entityId) {
      dispatch(fetchBudgetById(entityId));
    }
  }, [dispatch, entityId]);

  useEffect(() => {
    if (currentBudget) {
      setValue("budgetAmount", currentBudget.budgetAmount);
      setValue(
        "category",
        getOptionLabel(CreateBudgetOptions, currentBudget.category)
      );
      setValue("name", currentBudget.name);
      setValue("spentAmount", currentBudget.spentAmount);
    }
  }, [currentBudget, setValue]);

  const onSubmit = async (data: EditBudgetSchemaType) => {
    if (hasMadeNoChanges()) {
      return showDefaultToast(
        "No changes made.",
        "You haven't made any changes."
      );
    }

    let payload = {
      budgetId: entityId,
      ...data,
    };

    startTransition(async () => {
      const result = await updateBudget(payload);

      if (result.fieldErrors?.length) {
        result.fieldErrors.forEach(({ field, message }) => {
          setError(field as any, { type: "validate", message });
        });
      }

      if (result.error) {
        showErrorToast("An error occurred.", result.error);
      } else {
        router.refresh();
        showSuccessToast("Budget updated", "Budget updated successfully.");
        dispatch(closeGenericModal());
      }
    });
  };

  if (loading) {
    return <FormLoadingSpinner />;
  }

  const BudgetCategorySelectOptions = budgetOptions.map((option) => {
    return {
      label: option,
      value: option,
    };
  });

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
          defaultValue={getOptionLabel(
            CreateBudgetOptions,
            currentBudget?.category!
          )}
          selectOptions={BudgetCategorySelectOptions}
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
          type={"number"}
          step={"0.01"}
          register={register}
          errors={errors}
        />
        <Button type="submit" disabled={isLoading || isSubmitting || isPending}>
          Update
        </Button>
      </div>
    </form>
  );
};

export default EditUserBudgetForm;