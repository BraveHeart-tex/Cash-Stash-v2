"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Goal } from "@prisma/client";
import { IValidatedResponse } from "@/actions/types";
import { showErrorToast, showSuccessToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/redux/hooks";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import { useEffect } from "react";
import goalSchema, { GoalSchemaType } from "@/schemas/goal-schema";
import { createGoal, updateGoal } from "@/actions/goal";

interface IGoalFormProps {
  data?: Goal;
}

const GoalForm: React.FC<IGoalFormProps> = ({ data: goalToBeUpdated }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const form = useForm<GoalSchemaType>({
    resolver: zodResolver(goalSchema),
  });
  const entityId = goalToBeUpdated?.id;

  useEffect(() => {
    if (goalToBeUpdated) {
      const keys = Object.keys(
        goalToBeUpdated ?? {}
      ) as (keyof GoalSchemaType)[];
      if (keys.length) {
        keys.forEach((key) => {
          form.setValue(key, goalToBeUpdated[key]);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalToBeUpdated]);

  const handleFormSubmit = async (values: GoalSchemaType) => {
    let result;
    if (entityId) {
      result = await updateGoal(entityId, values);
    } else {
      result = await createGoal(values);
    }

    processFormErrors(result);
  };

  const processFormErrors = (result: IValidatedResponse<Goal>) => {
    if (result.fieldErrors.length) {
      result.fieldErrors.forEach((fieldError) => {
        form.setError(fieldError.field as any, {
          type: "manual",
          message: fieldError.message,
        });
      });
    }

    if (result.error) {
      showErrorToast("An error occurred.", result.error);
    } else {
      const successMessage = {
        create: "Your goal has been created.",
        update: "Your goal has been updated.",
      };
      router.refresh();
      showSuccessToast(
        "Success!",
        successMessage[entityId ? "update" : "create"]
      );
      dispatch(closeGenericModal());
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Name</FormLabel>
              <FormControl>
                <Input placeholder="Give your goal a name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="goalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currentAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          {!entityId ? "Create" : "Update"}
        </Button>
      </form>
    </Form>
  );
};

export default GoalForm;
