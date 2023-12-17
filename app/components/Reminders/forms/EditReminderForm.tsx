"use client";
import { fetchReminderById } from "@/app/redux/features/remindersSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import FormLoadingSpinner from "../../FormLoadingSpinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditReminderSchema } from "@/schemas";
import { EditReminderSchemaType } from "@/schemas/EditReminderSchema";
import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import FormSelect from "@/components/FormSelect";
import {
  showDefaultToast,
  showErrorToast,
  showSuccessToast,
} from "@/components/ui/use-toast";
import FormCheckbox from "@/components/FormCheckbox";
import { updateReminderAction } from "@/actions";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import { useRouter } from "next/navigation";
import DatePicker from "@/components/DatePicker";
import { getGeneric } from "@/actions/generic";
import { Reminder } from "@prisma/client";

interface IEditReminderFormProps {
  entityId: string;
}

const EditReminderForm = ({ entityId }: IEditReminderFormProps) => {
  let [isPending, startTransition] = useTransition();
  const [currentReminder, setCurrentReminder] = useState<Reminder>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (entityId) {
      startTransition(async () => {
        const result = await getGeneric<Reminder>({
          tableName: "reminder",
          whereCondition: { id: entityId },
        });

        if (result?.data) {
          setCurrentReminder(result.data);
        }
      });
    }
  }, [dispatch, entityId]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
  } = useForm<EditReminderSchemaType>({
    defaultValues: {
      title: "",
      description: "",
      amount: 0,
      reminderDate: "",
      isIncome: "income",
      isRead: "isNotRead",
    },
    // @ts-ignore
    resolver: zodResolver(EditReminderSchema),
  });

  useEffect(() => {
    if (currentReminder) {
      setValue("title", currentReminder.title);
      setValue("description", currentReminder.description);
      setValue("amount", currentReminder.amount);
      setValue("isIncome", currentReminder.isIncome ? "income" : "expense");
      setValue("reminderDate", currentReminder.reminderDate.toISOString());
    }
  }, [currentReminder, setValue]);

  const onSubmit = async (data: EditReminderSchemaType) => {
    if (hasMadeNoChanges()) {
      return showDefaultToast(
        "No changes made.",
        "You have not made any changes."
      );
    }

    let payload = {
      reminderId: entityId,
      ...data,
    };

    startTransition(async () => {
      const result = await updateReminderAction(payload);
      if (result?.error) {
        showErrorToast("An error occurred.", result.error);
      } else {
        showSuccessToast("Reminder updated.", "Reminder updated successfully.");
        router.refresh();
        dispatch(closeGenericModal());
      }
    });
  };

  if (isPending) {
    return <FormLoadingSpinner />;
  }

  const hasMadeNoChanges = () => {
    let isIncome = getValues("isIncome") === "income" ? true : false;
    return (
      getValues("title") === currentReminder?.title &&
      getValues("description") === currentReminder?.description &&
      getValues("amount") === currentReminder?.amount &&
      isIncome === currentReminder?.isIncome &&
      getValues("reminderDate") ===
        new Date(currentReminder?.reminderDate).toLocaleDateString("en-CA") &&
      getValues("isRead") === (currentReminder?.isRead ? "isRead" : "isNotRead")
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4">
        <FormInput
          name={"title"}
          label={"Title"}
          placeholder={"Notification title"}
          type={"text"}
          register={register}
          errors={errors}
        />
        <FormInput
          name={"description"}
          label={"Description"}
          placeholder={"Notification description"}
          type={"text"}
          register={register}
          errors={errors}
        />
        <FormInput
          name={"amount"}
          label={"Amount"}
          placeholder={"Notification amount"}
          type={"number"}
          register={register}
          errors={errors}
        />
        <DatePicker
          name={"reminderDate"}
          label={"Reminder Date"}
          placeholder={"Select a reminder date"}
          register={register}
          defaultValue={currentReminder?.reminderDate.toISOString()}
          errors={errors}
          className="w-full"
          onChange={(value) => {
            setValue("reminderDate", value);
          }}
        />
        <FormSelect
          defaultValue={currentReminder?.isIncome ? "income" : "expense"}
          selectOptions={[
            { label: "Income", value: "income" },
            { label: "Expense", value: "expense" },
          ]}
          nameParam={"isIncome"}
          label={"Transaction type"}
          placeholder={""}
          register={register}
          errors={errors}
          onChange={(value) => {
            let valueToSet: "income" | "expense" = "income";
            if (value === "expense") {
              valueToSet = "expense";
            }
            setValue("isIncome", valueToSet);
          }}
        />
        <FormCheckbox
          name={"isRead"}
          label={"Mark as read"}
          register={register}
          errors={errors}
          defaultChecked={currentReminder?.isRead}
          onChange={(value) => {
            let valueToSet: "isNotRead" | "isRead" = "isNotRead";
            if (value) {
              valueToSet = "isRead";
            }
            setValue("isRead", valueToSet);
          }}
        />
        {isPending ? (
          <Button>Loading...</Button>
        ) : (
          <Button
            type="submit"
            disabled={isPending || isPending || isSubmitting}
            loading={isPending}
          >
            Update
          </Button>
        )}
      </div>
    </form>
  );
};

export default EditReminderForm;
