"use client";
import {
  Stack,
  FormLabel,
  Input,
  FormErrorMessage,
  FormControl,
  Select,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchBudgetById } from "../../../redux/features/currentBudgetSlice";
import CreateBudgetOptions from "../../../../lib/CreateBudgetOptions";
import { getOptionLabel } from "@/lib/CreateUserAccountOptions";
import axios from "axios";
import {
  fetchBudgets,
  setEditBudgetModalOpen,
} from "../../../redux/features/budgetSlice";
import FormLoadingSpinner from "../../FormLoadingSpinner";

interface IEditBudgetFormProps {
  selectedBudgetId: number;
}

const EditUserBudgetForm = ({ selectedBudgetId }: IEditBudgetFormProps) => {
  const toast = useToast();
  const budgetOptions = Object.values(CreateBudgetOptions);
  const { currentBudget, isLoading: isCurrentBudgetLoading } = useAppSelector(
    (state) => state.currentBudgetReducer
  );
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      budgetAmount: 0,
      category: "",
      spentAmount: 0,
    },
  });

  const loading = isCurrentBudgetLoading || isLoading;

  useEffect(() => {
    if (selectedBudgetId) {
      dispatch(fetchBudgetById(selectedBudgetId));
    }
  }, [dispatch, selectedBudgetId]);

  useEffect(() => {
    if (currentBudget) {
      setValue("budgetAmount", currentBudget.budgetAmount);
      setValue(
        "category",
        getOptionLabel(CreateBudgetOptions, currentBudget.category)
      );
      setValue("spentAmount", currentBudget.spentAmount);
    }
  }, [currentBudget, setValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await axios.put(
        `/api/user/budgets/${selectedBudgetId}`,
        data
      );

      if (response.status === 200) {
        dispatch(fetchBudgets());
        toast({
          title: "Budget updated.",
          description:
            "Budget updated successfully. You can close this window now.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        dispatch(setEditBudgetModalOpen(false));
      }
    } catch (error: any) {
      toast({
        title: "An error occurred.",
        description: error.response?.data.error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  if (loading) {
    return <FormLoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.budgetAmount}>
          <FormLabel>Budget Amount</FormLabel>
          <Input
            type="number"
            id="budgetAmount"
            {...register("budgetAmount", {
              required: "Budget amount is required.",
              min: {
                value: 10,
                message: "Budget amount must be at least 10₺",
              },
              max: {
                value: 1000000,
                message: "Budget amount must be at most 1.000.000₺",
              },
            })}
          />
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.budgetAmount && errors.budgetAmount.message}
          </FormErrorMessage>
        </FormControl>
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.category}>
          <FormLabel>Budget Category</FormLabel>
          <Select
            id="category"
            placeholder="Select budget category"
            {...register("category", {
              required: "Category is required.",
            })}
          >
            {budgetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.category && errors.category.message}
          </FormErrorMessage>
        </FormControl>
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.spentAmount}>
          <FormLabel>Budget Spent (₺)</FormLabel>
          <Input
            type="number"
            id="spentAmount"
            {...register("spentAmount", {
              required: "Budget spent is required.",
              min: {
                value: 0,
                message: "Budget spent must be at least 0₺",
              },
              max: {
                value: 1000000,
                message: "Budget spent must be at most 1.000.000₺",
              },
            })}
          />
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.spentAmount && errors.spentAmount.message}
          </FormErrorMessage>
        </FormControl>
        <Button type="submit" isLoading={isSubmitting} isDisabled={isLoading}>
          Update
        </Button>
      </Stack>
    </form>
  );
};

export default EditUserBudgetForm;
