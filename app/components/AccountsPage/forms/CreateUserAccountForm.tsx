"use client";
import CreateUserAccountOptions from "@/lib/CreateUserAccountOptions";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/app/redux/hooks";
import {
  fetchCurrentUserAccounts,
  setIsCreateAccountModalOpen,
} from "@/app/redux/features/userAccountSlice";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import CreateUserAccountSchema, {
  CreateUserAccountSchemaType,
} from "@/schemas/CreateUserAccountSchema";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { Button } from "@/components/ui/button";
import { registerBankAccountAction } from "@/actions";

const CreateUserAccountForm = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  let [isPending, startTransition] = useTransition();
  const accountOptions = Object.values(CreateUserAccountOptions);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateUserAccountSchemaType>({
    defaultValues: {
      balance: 10,
      category: "checking",
      name: "",
    },
    // @ts-ignore
    resolver: zodResolver(CreateUserAccountSchema),
  });

  const onSubmit = async (data: CreateUserAccountSchemaType) => {
    startTransition(async () => {
      const result = await registerBankAccountAction(data);
      if (result.error) {
        toast({
          title: "Error creating account.",
          description: "There was an error creating your account.",
          variant: "destructive",
          duration: 4000,
        });
      } else {
        dispatch(fetchCurrentUserAccounts());
        toast({
          title: "Account created.",
          description: "Your account has been created",
          variant: "default",
          duration: 4000,
        });
        dispatch(setIsCreateAccountModalOpen(false));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4">
        <FormInput
          name={"name"}
          label={"Account Name"}
          placeholder={"Account name"}
          type={"text"}
          register={register}
          errors={errors}
        />
        <FormSelect
          defaultValue={"Checking Account"}
          selectOptions={accountOptions}
          defaultLabel={"Account Type"}
          name={"category"}
          label={"Account Type"}
          placeholder={"Select your account type"}
          register={register}
          errors={errors}
          onChange={(value) => {
            setValue("category", value);
          }}
        />
        <FormInput
          name={"balance"}
          label={"Account Balance ₺"}
          placeholder={"Balance (₺)"}
          type={"number"}
          register={register}
          errors={errors}
        />
        {isPending ? (
          <Button disabled={isPending}>Loading...</Button>
        ) : (
          <Button type="submit" disabled={isSubmitting || isPending}>
            Create
          </Button>
        )}
      </div>
    </form>
  );
};

export default CreateUserAccountForm;
