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
import { useRouter } from "@/navigation";
import { useEffect, useTransition } from "react";
import useGenericModalStore from "@/store/genericModalStore";
import { toast } from "sonner";
import { ReminderSelectModel, reminders } from "@/lib/database/schema";

import reminderSchema, { ReminderSchemaType } from "@/schemas/reminder-schema";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/stringUtils/cn";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { createReminder, updateReminder } from "@/server/reminder";
import { generateOptionsFromEnums } from "@/lib/utils/stringUtils/generateOptionsFromEnums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { compareMatchingKeys } from "@/lib/utils/objectUtils/compareMatchingKeys";
import { BaseValidatedResponse } from "@/typings/baseTypes";

type ReminderFormProps = {
  data?: ReminderSelectModel;
};

const ReminderForm = ({ data: reminderToBeUpdated }: ReminderFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const closeGenericModal = useGenericModalStore(
    (state) => state.closeGenericModal
  );
  const form = useForm<ReminderSchemaType>({
    resolver: zodResolver(reminderSchema),
  });
  const entityId = reminderToBeUpdated?.id;

  useEffect(() => {
    if (reminderToBeUpdated) {
      const keys = Object.keys(
        reminderToBeUpdated ?? {}
      ) as (keyof ReminderSchemaType)[];
      if (keys.length) {
        keys.forEach((key) => {
          form.setValue(key, reminderToBeUpdated[key]);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reminderToBeUpdated]);

  const handleFormSubmit = async (values: ReminderSchemaType) => {
    if (entityId && compareMatchingKeys(reminderToBeUpdated, values)) {
      toast.info("No changes detected.", {
        description: "You haven't made any changes.",
      });
      return;
    }

    startTransition(async () => {
      let result;

      if (entityId) {
        result = await updateReminder({ ...values, id: entityId });
      } else {
        result = await createReminder(values);
      }

      processFormSubmissionResult(result);
    });
  };

  const processFormSubmissionResult = (
    result: BaseValidatedResponse<ReminderSelectModel>
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
    reminders.recurrence.enumValues
  );

  const reminderTypeOptions = generateOptionsFromEnums(
    reminders.type.enumValues
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
                defaultValue={reminderToBeUpdated?.type! || field.value}
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
                  defaultValue={reminderToBeUpdated?.recurrence! || field.value}
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
                            !field.value && "text-muted-foreground"
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
                        selected={field.value!}
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
