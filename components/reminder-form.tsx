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
import { IValidatedResponse } from "@/actions/types";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import useGenericModalStore from "@/store/genericModalStore";
import { toast } from "sonner";
import { ReminderSelectModel } from "@/lib/database/schema";
import { formHasChanged } from "@/lib/utils/objectUtils/formHasChanged";
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
import { createReminder, updateReminder } from "@/actions/reminder";

interface IReminderFormProps {
  data?: ReminderSelectModel;
}

const ReminderForm = ({ data: reminderToBeUpdated }: IReminderFormProps) => {
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
    if (entityId && formHasChanged(reminderToBeUpdated, values)) {
      // showDefaultToast("No changes detected.", "You haven't made any changes.");
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

      processFormErrors(result);
    });
  };

  const processFormErrors = (
    result: IValidatedResponse<ReminderSelectModel>
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
          name="reminderDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reminder Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
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
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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

export default ReminderForm;
