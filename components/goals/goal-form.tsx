"use client";
import { Button } from "@/components/ui/button";
import CurrencyFormLabel from "@/components/ui/currency-form-label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MaskedAmountInput from "@/components/ui/masked-amount-input";
import type { GoalSelectModel } from "@/lib/database/schema";
import { compareMatchingKeys } from "@/lib/utils/objectUtils/compareMatchingKeys";
import useZodResolver from "@/lib/zod-resolver-wrapper";
import { useRouter } from "@/navigation";
import { type GoalSchemaType, getGoalSchema } from "@/schemas/goal-schema";
import { createGoal, updateGoal } from "@/server/goal";
import useGenericModalStore from "@/store/genericModalStore";
import type { BaseValidatedResponse } from "@/typings/baseTypes";
import { useTranslations } from "next-intl";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type GoalFormProps = {
  data?: GoalSelectModel;
};

const GoalForm = ({ data: goalToBeUpdated }: GoalFormProps) => {
  const router = useRouter();
  const t = useTranslations("Components.GoalForm");
  const zodT = useTranslations("Zod.Goal");
  const [isPending, startTransition] = useTransition();

  const closeGenericModal = useGenericModalStore(
    (state) => state.closeGenericModal,
  );

  const goalSchema = getGoalSchema({
    currentAmountRequired: zodT("currentAmountRequired"),
    currentAmountTooSmall: zodT("currentAmountTooSmall"),
    goalAmountRequired: zodT("goalAmountRequired"),
    goalAmountTooSmall: zodT("goalAmountTooSmall"),
    nameRequired: zodT("nameRequired"),
    nameTooLong: zodT("nameTooLong"),
  });

  const form = useForm<GoalSchemaType>({
    resolver: useZodResolver(goalSchema),
  });

  const entityId = goalToBeUpdated?.id;

  useEffect(() => {
    if (!goalToBeUpdated) return;
    const keys = Object.keys(goalToBeUpdated ?? {}) as (keyof GoalSchemaType)[];
    if (!keys.length) return;

    for (const key of keys) {
      form.setValue(key, goalToBeUpdated[key]);
    }
  }, [goalToBeUpdated, form.setValue]);

  const handleFormSubmit = async (values: GoalSchemaType) => {
    if (entityId && compareMatchingKeys(goalToBeUpdated, values)) {
      toast.info(t("noChangesMessage"), {
        description: t("noChangesDescription"),
      });
      return;
    }

    startTransition(async () => {
      let result: BaseValidatedResponse<GoalSelectModel>;
      if (entityId) {
        result = await updateGoal({
          goalId: entityId,
          ...values,
        });
      } else {
        result = await createGoal(values);
      }

      processFormSubmissionResult(result);
    });
  };

  const processFormSubmissionResult = (
    result: BaseValidatedResponse<GoalSelectModel>,
  ) => {
    if (result.fieldErrors.length) {
      for (const fieldError of result.fieldErrors) {
        form.setError(fieldError.field as keyof GoalSchemaType, {
          type: "manual",
          message: fieldError.message,
        });
      }
    }

    if (result.error) {
      toast.error(t("anErrorOccurredMessage"), {
        description: result.error,
      });
    } else {
      const successMessage = t(
        `successMessage.${entityId ? "update" : "create"}`,
      );
      router.refresh();
      toast.success(successMessage);
      closeGenericModal();
    }
  };

  const submitButtonLabel = t(
    `submitButtonLabel.${entityId ? "update" : "create"}`,
  );

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
              <FormLabel>{t("nameField.label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("nameField.placeholder")} {...field} />
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
              <CurrencyFormLabel label={t("goalAmountField.label")} />
              <FormControl>
                <MaskedAmountInput
                  initialValue={field.value}
                  placeholder={t("goalAmountField.placeholder")}
                  id="goalAmount"
                  onMaskedValueChange={(value) => {
                    field.onChange(value);
                  }}
                  ref={field.ref}
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
              <CurrencyFormLabel label={t("currentAmountField.label")} />
              <FormControl>
                <MaskedAmountInput
                  initialValue={field.value}
                  placeholder={t("currentAmountField.placeholder")}
                  id="currentAmount"
                  onMaskedValueChange={(value) => {
                    field.onChange(value);
                  }}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          name="submit"
          type="submit"
          aria-label={submitButtonLabel}
          loading={isPending}
          disabled={form.formState.isSubmitting || isPending}
        >
          {submitButtonLabel}
        </Button>
      </form>
    </Form>
  );
};

export default GoalForm;
