"use client";

import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/app/redux/hooks";
import { fetchGoals } from "@/app/redux/features/goalSlice";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import CreateGoalSchema, {
  CreateGoalSchemaType,
} from "@/schemas/CreateGoalSchema";
import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { createGoalAction } from "@/actions";

const CreateUserGoalForm = () => {
  let [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateGoalSchemaType>({
    defaultValues: {
      goalName: "",
      goalAmount: 10,
      currentAmount: 0,
    },
    // @ts-ignore
    resolver: zodResolver(CreateGoalSchema),
  });

  const onSubmit = async (data: CreateGoalSchemaType) => {
    startTransition(async () => {
      const result = await createGoalAction(data);
      if (result.error) {
        toast({
          title: "An error occurred.",
          description: result.error,
          variant: "destructive",
          duration: 4000,
        });
      } else {
        dispatch(fetchGoals());
        toast({
          title: "Goal created.",
          description:
            "Your goal has been created. You can close this window now.",
          variant: "default",
          duration: 4000,
        });
        dispatch(closeGenericModal());
      }
    });
  };

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

        <Button type="submit" disabled={isSubmitting || isPending}>
          Create
        </Button>
      </div>
    </form>
  );
};

export default CreateUserGoalForm;
