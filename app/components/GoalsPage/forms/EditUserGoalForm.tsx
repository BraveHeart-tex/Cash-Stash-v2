"use client";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchGoalById } from "@/app/redux/features/currentGoalSlice";
import { fetchGoals } from "@/app/redux/features/goalSlice";
import FormLoadingSpinner from "../../FormLoadingSpinner";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import EditGoalSchema, { EditGoalSchemaType } from "@/schemas/EditGoalSchema";
import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { updateGoalByIdAction } from "@/actions";

interface IEditUserGoalFormProps {
  entityId: number;
}

const EditUserGoalForm = ({ entityId }: IEditUserGoalFormProps) => {
  let [isPending, startTransition] = useTransition();
  const { currentGoal } = useAppSelector((state) => state.currentGoalReducer);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    setValue,
  } = useForm<EditGoalSchemaType>({
    defaultValues: {
      goalName: "",
      goalAmount: 10,
      currentAmount: 0,
    },
    // @ts-ignore
    resolver: zodResolver(EditGoalSchema),
  });

  useEffect(() => {
    if (entityId) {
      dispatch(fetchGoalById(entityId));
    }
  }, [dispatch, entityId]);

  useEffect(() => {
    if (currentGoal) {
      setValue("goalName", currentGoal.name);
      setValue("goalAmount", currentGoal.goalAmount);
      setValue("currentAmount", currentGoal.currentAmount);
    }
  }, [currentGoal, setValue]);

  const onSubmit = async (data: EditGoalSchemaType) => {
    let payload = {
      goalId: entityId,
      ...data,
    };

    startTransition(async () => {
      const result = await updateGoalByIdAction(payload);
      if (result?.error) {
        showErrorToast("An error occurred.", result.error);
      } else {
        dispatch(fetchGoals());
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
          name={"goalName"}
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
