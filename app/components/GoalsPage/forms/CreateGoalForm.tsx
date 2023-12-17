"use client";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/app/redux/hooks";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import CreateGoalSchema, {
  CreateGoalSchemaType,
} from "@/schemas/CreateGoalSchema";
import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { createGenericWithCurrentUser } from "@/actions/generic";
import { Goal } from "@prisma/client";
import { useRouter } from "next/navigation";

const CreateUserGoalForm = () => {
  let [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateGoalSchemaType>({
    defaultValues: {
      name: "",
      goalAmount: 10,
      currentAmount: 0,
    },
    resolver: zodResolver(CreateGoalSchema),
  });

  const onSubmit = async (data: CreateGoalSchemaType) => {
    startTransition(async () => {
      const result = await createGenericWithCurrentUser<Goal>({
        tableName: "goal",
        data,
      });

      if (result?.error) {
        showErrorToast("An error occurred.", result.error as string);
      } else {
        router.refresh();
        showSuccessToast("Goal created.", "Your goal has been created.");
        dispatch(closeGenericModal());
      }
    });
  };

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

        <Button type="submit" disabled={isSubmitting || isPending}>
          Create
        </Button>
      </div>
    </form>
  );
};

export default CreateUserGoalForm;
