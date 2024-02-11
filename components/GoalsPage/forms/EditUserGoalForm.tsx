"use client";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchGoalById } from "@/app/redux/features/currentGoalSlice";
import FormLoadingSpinner from "../../FormLoadingSpinner";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import {
  showDefaultToast,
  showErrorToast,
  showSuccessToast,
} from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import EditGoalSchema, { EditGoalSchemaType } from "@/schemas/EditGoalSchema";
import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { updateGeneric } from "@/actions/generic";
import { Goal } from "@prisma/client";
import { useRouter } from "next/navigation";

interface IEditUserGoalFormProps {
  entityId: string;
}

const EditUserGoalForm = ({ entityId }: IEditUserGoalFormProps) => {
  let [isPending, startTransition] = useTransition();
  const { currentGoal } = useAppSelector((state) => state.currentGoalReducer);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    setValue,
    getValues,
  } = useForm<EditGoalSchemaType>({
    defaultValues: {
      name: "",
      goalAmount: 10,
      currentAmount: 0,
    },
    resolver: zodResolver(EditGoalSchema),
  });

  const hasMadeNoChanges = () => {
    const { name, goalAmount, currentAmount } = getValues();
    return (
      name === currentGoal?.name &&
      goalAmount === currentGoal?.goalAmount &&
      currentAmount === currentGoal?.currentAmount
    );
  };

  useEffect(() => {
    if (entityId) {
      dispatch(fetchGoalById(entityId));
    }
  }, [dispatch, entityId]);

  useEffect(() => {
    if (currentGoal) {
      setValue("name", currentGoal.name);
      setValue("goalAmount", currentGoal.goalAmount);
      setValue("currentAmount", currentGoal.currentAmount);
    }
  }, [currentGoal, setValue]);

  const onSubmit = async (data: EditGoalSchemaType) => {
    if (hasMadeNoChanges()) {
      return showDefaultToast(
        "No changes made.",
        "You haven't made any changes."
      );
    }

    let payload = {
      id: entityId,
      ...data,
    };

    startTransition(async () => {
      const result = await updateGeneric<Goal>({
        tableName: "goal",
        data: payload,
        whereCondition: {
          id: entityId,
        },
      });

      if (result?.error) {
        showErrorToast("An error occurred.", result.error as string);
      } else {
        router.refresh();
        showSuccessToast("Goal updated.", "Your goal has been updated.");
        dispatch(closeGenericModal());
      }
    });
  };

  if (!currentGoal) {
    return <FormLoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4">
        <FormInput
          name={"name"}
          label={"Goal Name"}
          placeholder={"Goal name"}
          type={"text"}
          register={register}
          errors={errors}
        />
        <FormInput
          name={"goalAmount"}
          label={"Goal Amount"}
          placeholder={"Goal amount"}
          type={"number"}
          register={register}
          errors={errors}
        />
        <FormInput
          name={"currentAmount"}
          label={"Current Amount"}
          placeholder={"Current amount"}
          type={"number"}
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

export default EditUserGoalForm;
