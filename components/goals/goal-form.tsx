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
import { BaseValidatedResponse } from "@/server/types";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import goalSchema, { GoalSchemaType } from "@/schemas/goal-schema";
import { createGoal, updateGoal } from "@/server/goal";
import useGenericModalStore from "@/store/genericModalStore";
import { toast } from "sonner";
import { GoalSelectModel } from "@/lib/database/schema";
import CurrencyFormLabel from "../ui/currency-form-label";
import { compareMatchingKeys } from "@/lib/utils/objectUtils/compareMatchingKeys";

type GoalFormProps = {
  data?: GoalSelectModel;
};

const GoalForm = ({ data: goalToBeUpdated }: GoalFormProps) => {
  const [isPending, startTransition] = useTransition();
  const closeGenericModal = useGenericModalStore(
    (state) => state.closeGenericModal
  );
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
    if (entityId && compareMatchingKeys(goalToBeUpdated, values)) {
      toast.info("No changes detected.", {
        description: "You haven't made any changes to your goal.",
      });
      return;
    }

    startTransition(async () => {
      let result;
      if (entityId) {
        result = await updateGoal(entityId, values);
      } else {
        result = await createGoal(values);
      }

      processFormSubmissionResult(result);
    });
  };

  const processFormSubmissionResult = (
    result: BaseValidatedResponse<GoalSelectModel>
  ) => {
    if (result.fieldErrors.length) {
      result.fieldErrors.forEach((fieldError) => {
        form.setError(fieldError.field as any, {
          type: "manual",
          message: fieldError.message,
        });
      });
    }

    if (result.error) {
      toast.error("An error occurred.", {
        description: result.error,
      });
    } else {
      const successMessage = {
        create: "Your goal has been created.",
        update: "Your goal has been updated.",
      };
      router.refresh();
      toast.success("Success!", {
        description: successMessage[entityId ? "update" : "create"],
      });
      closeGenericModal();
    }
  };

  const renderSubmitButtonContent = () => {
    if (form.formState.isSubmitting || isPending) {
      return "Submitting...";
    }

    return entityId ? "Update" : "Create";
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
              <CurrencyFormLabel label="Goal Amount" />
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 1000"
                  step="0.01"
                  {...field}
                />
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
              <CurrencyFormLabel label="Current Amount" />
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 200"
                  step="0.01"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={form.formState.isSubmitting || isPending}
        >
          {renderSubmitButtonContent()}
        </Button>
      </form>
    </Form>
  );
};

export default GoalForm;
