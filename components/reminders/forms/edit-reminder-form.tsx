"use client";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import FormLoadingSpinner from "../../form-loading-spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditReminderSchema } from "@/schemas";
import { EditReminderSchemaType } from "@/schemas/EditReminderSchema";
import FormInput from "@/components/form-input";
import { Button } from "@/components/ui/button";
import {
  showDefaultToast,
  showErrorToast,
  showSuccessToast,
} from "@/components/ui/use-toast";
import { updateReminder } from "../../../actions";
import { useRouter } from "next/navigation";
import DatePicker from "@/components/date-picker";
import { getGeneric } from "@/actions/generic";
import { Reminder } from "@prisma/client";
import useGenericModalStore from "@/store/genericModalStore";

interface IEditReminderFormProps {
  entityId: string;
}

const EditReminderForm = ({ entityId }: IEditReminderFormProps) => {
  let [isPending, startTransition] = useTransition();
  const [currentReminder, setCurrentReminder] = useState<Reminder>();
  const router = useRouter();
  const closeGenericModal = useGenericModalStore(
    (state) => state.closeGenericModal
  );

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
  }, [entityId]);

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
      const result = await updateReminder(payload);
      if (result?.error) {
        showErrorToast("An error occurred.", result.error);
      } else {
        showSuccessToast("Reminder updated.", "Reminder updated successfully.");
        router.refresh();
        closeGenericModal();
      }
    });
  };

  if (isPending) {
    return <FormLoadingSpinner />;
  }

  // TODO:
  const hasMadeNoChanges = () => {
    let isIncome = getValues("isIncome") === "income" ? true : false;
    return false;
    // return (
    //   getValues("title") === currentReminder?.title &&
    //   getValues("description") === currentReminder?.description &&
    //   getValues("amount") === currentReminder?.amount &&
    //   isIncome === currentReminder?.isIncome &&
    //   getValues("reminderDate") ===
    //     new Date(currentReminder?.reminderDate).toLocaleDateString("en-CA") &&
    //   getValues("isRead") === (currentReminder?.isRead ? "isRead" : "isNotRead")
    // );
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
