"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type ReminderSelectModel, reminders } from "@/lib/database/schema";
import useZodResolver from "@/lib/zod-resolver-wrapper";
import { useRouter } from "@/navigation";
import useGenericModalStore from "@/store/genericModalStore";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { compareMatchingKeys } from "@/lib/utils/objectUtils/compareMatchingKeys";
import { cn } from "@/lib/utils/stringUtils/cn";
import { generateOptionsFromEnums } from "@/lib/utils/stringUtils/generateOptionsFromEnums";
import reminderSchema, {
  type ReminderSchemaType,
} from "@/schemas/reminder-schema";
import { createReminder, updateReminder } from "@/server/reminder";
import type { BaseValidatedResponse } from "@/typings/baseTypes";
import type { ReminderUpdateModel } from "@/typings/reminders";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

type ReminderFormProps = {
  data?: ReminderSelectModel;
};

const ReminderForm = ({ data: reminderToBeUpdated }: ReminderFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const closeGenericModal = useGenericModalStore(
    (state) => state.closeGenericModal,
  );
  const form = useForm<ReminderSchemaType>({
    resolver: useZodResolver(reminderSchema),
  });
  const entityId = reminderToBeUpdated?.id;

  // biome-ignore lint/correctness/useExhaustiveDependencies: This is intentional
  useEffect(() => {
    if (!reminderToBeUpdated) return;
    const keys = Object.keys(
      reminderToBeUpdated ?? {},
    ) as (keyof ReminderSchemaType)[];
    if (!keys.length) return;

    for (const key of keys) {
      form.setValue(key, reminderToBeUpdated[key]);
    }
  }, [reminderToBeUpdated]);

  const handleFormSubmit = async (values: ReminderSchemaType) => {
    if (entityId && compareMatchingKeys(reminderToBeUpdated, values)) {
      toast.info("No changes detected.", {
        description: "You haven't made any changes.",
      });
      return;
    }

    startTransition(async () => {
      let result: BaseValidatedResponse<
        ReminderSelectModel | ReminderUpdateModel
      >;

      if (entityId) {
        result = await updateReminder({ ...values, id: entityId });
      } else {
        result = await createReminder(values);
      }

      processFormSubmissionResult(result);
    });
  };

  const processFormSubmissionResult = (
    result: BaseValidatedResponse<ReminderSelectModel | ReminderUpdateModel>,
  ) => {
    if (result.fieldErrors.length) {
      for (const fieldError of result.fieldErrors) {
        form.setError(fieldError.field as keyof ReminderSchemaType, {
          type: "manual",
          message: fieldError.message,
        });
      }
    }

    if (result.error) {
      toast.error("An error occurred.", {
        description: result.error,
      });
    } else {
      const successMessage = {
        create: "Your reminder has been created.",
        update: "Your reminder has been updated.",
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

  const recurrenceOptions = generateOptionsFromEnums(
    reminders.recurrence.enumValues,
  );

  const reminderTypeOptions = generateOptionsFromEnums(
    reminders.type.enumValues,
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reminder Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Example: Pay the electricity bill"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Example: The electricity bill is due on the 15th of this month."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reminder Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                defaultValue={reminderToBeUpdated?.type || field.value}
              >
                <FormControl>
                  <SelectTrigger ref={field.ref}>
                    <SelectValue placeholder="Select a reminder type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {reminderTypeOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("type") === "RECURRING" && (
          <FormField
            control={form.control}
            name="recurrence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reminder Recurrence</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  defaultValue={
                    reminderToBeUpdated?.recurrence || field.value || "DAILY"
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a recurrence period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {recurrenceOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {form.watch("type") === "ONE_TIME" && (
          <FormField
            control={form.control}
            name="reminderDate"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Reminder Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || new Date()}
                        onSelect={field.onChange}
                        disablePastDays
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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

export default ReminderForm;
