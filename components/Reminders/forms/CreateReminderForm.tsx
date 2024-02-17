"use client";
import { createReminderAction } from "@/actions";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import { useAppDispatch } from "@/app/redux/hooks";
import DatePicker from "@/components/DatePicker";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { Button } from "@/components/ui/button";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import CreateReminderSchema, { CreateReminderSchemaType } from "@/schemas/CreateReminderSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

const CreateReminderForm = () => {
  let [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateReminderSchemaType>({
    defaultValues: {
      title: "",
      description: "",
      amount: 0,
      reminderDate: "",
      isIncome: "income",
      isRead: "isNotRead",
    },
    resolver: zodResolver(CreateReminderSchema),
  });

  const onSubmit = async (data: CreateReminderSchemaType) => {
    startTransition(async () => {
      const result = await createReminderAction(data);
      if (result?.error) {
        return showErrorToast("An error occurred.", result.error);
      } else {
        router.refresh();
        showSuccessToast("Reminder created.", "Your reminder has been created.");
        dispatch(closeGenericModal());
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4">
        <FormInput
          name={"title"}
          label={"Title"}
          placeholder={"Reminder title"}
          type={"text"}
          register={register}
          errors={errors}
        />
        <FormInput
          name={"description"}
          label={"Description"}
          placeholder={"Reminder description"}
          type={"text"}
          register={register}
          errors={errors}
        />
        <FormInput
          name={"amount"}
          label={"Amount"}
          placeholder={"Reminder amount"}
          type={"number"}
          register={register}
          errors={errors}
        />
        <DatePicker
          name={"reminderDate"}
          label={"Reminder Date"}
          placeholder={"Select a reminder date"}
          register={register}
          errors={errors}
          className="w-full"
          onChange={(value) => {
            setValue("reminderDate", value);
          }}
        />
        <FormSelect
          defaultValue={"expense"}
          selectOptions={[
            { value: "income", label: "Income" },
            { value: "expense", label: "Expense" },
          ]}
          nameParam={"isIncome"}
          label={"Reminder Type"}
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
        <Button type="submit" disabled={isSubmitting || isPending}>
          Create
        </Button>
      </div>
    </form>
  );
};

export default CreateReminderForm;
