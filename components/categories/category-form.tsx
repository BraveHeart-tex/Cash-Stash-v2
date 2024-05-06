import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import categorySchema, { CategorySchemaType } from "@/schemas/category-schema";
import { useEffect, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORY_TYPES } from "@/lib/constants";
import { createCategory, updateCategory } from "@/server/category";
import { toast } from "sonner";
import { CategorySelectModel } from "@/lib/database/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { compareMatchingKeys } from "@/lib/utils/objectUtils/compareMatchingKeys";
import {
  CategoryUpdateModel,
  CreateCategoryReturnType,
  UpdateCategoryReturnType,
} from "@/typings/categories";
import { useTranslations } from "next-intl";

type CategoryFormProps = {
  // eslint-disable-next-line no-unused-vars
  afterSave?: (values: CategorySelectModel) => void;
  defaultTypeValue?: (typeof CATEGORY_TYPES)[keyof typeof CATEGORY_TYPES];
  showTypeOptions: boolean;
  data?: CategorySelectModel;
};

const CategoryForm = ({
  data: categoryToUpdate,
  afterSave,
  showTypeOptions = true,
  defaultTypeValue = CATEGORY_TYPES.BUDGET,
}: CategoryFormProps) => {
  const t = useTranslations("Components.CategoryForm");
  let [isPending, startTransition] = useTransition();
  const form = useForm<CategorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type: defaultTypeValue,
    },
  });
  const isEditMode = !!categoryToUpdate;

  useEffect(() => {
    if (categoryToUpdate) {
      const keys = Object.keys(
        categoryToUpdate
      ) as (keyof CategorySchemaType)[];
      keys.forEach((key) => {
        form.setValue(key, categoryToUpdate[key]);
      });
    }
  }, [categoryToUpdate, form]);

  const handleFormSubmit = async (values: CategorySchemaType) => {
    if (isEditMode && compareMatchingKeys(categoryToUpdate, values)) {
      return toast.info(t("noChangesMessage"), {
        description: t("noChangesDescription"),
      });
    }

    startTransition(async () => {
      const updatedValues = isEditMode
        ? { ...values, id: categoryToUpdate.id }
        : { ...values };

      const response = isEditMode
        ? await updateCategory(updatedValues as CategoryUpdateModel)
        : await createCategory(updatedValues);

      if ("data" in response && !isEditMode) {
        afterSave?.(response.data as CategorySelectModel);
      }

      processFormSubmissionResult(response);
    });
  };

  const processFormSubmissionResult = (
    result: Awaited<CreateCategoryReturnType | UpdateCategoryReturnType>
  ) => {
    if ("fieldErrors" in result) {
      result.fieldErrors.forEach((fieldError) => {
        form.setError(fieldError.field as any, {
          type: "manual",
          message: fieldError.message,
        });
      });

      return toast.error(t("anErrorOccurredMessage"), {
        description: result.error,
      });
    }

    toast.success(t(`successMessage.${isEditMode ? "update" : "create"}`));
  };

  // stops the parent form from submitting
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      if (typeof event.preventDefault === "function") {
        event.preventDefault();
      }

      if (typeof event.stopPropagation === "function") {
        event.stopPropagation();
      }
    }

    return form.handleSubmit(handleFormSubmit)(event);
  };

  return (
    <Form {...form}>
      <form
        id="category-form"
        role="form"
        name="category-form"
        aria-label="Category Form"
        onSubmit={onSubmit}
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
        {showTypeOptions && (
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("typeField.label")}</FormLabel>
                <Select
                  key={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("typeField.placeholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={CATEGORY_TYPES.BUDGET.toString()}>
                      {t("typeField.options.budget")}
                    </SelectItem>
                    <SelectItem value={CATEGORY_TYPES.TRANSACTION.toString()}>
                      {t("typeField.options.transaction")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>{t("typeField.description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button
          type="submit"
          name="submit-category-form"
          aria-label="Submit category form"
          loading={isPending}
          disabled={isPending || form.formState.isSubmitting}
        >
          {t(`submitButtonLabel.${isEditMode ? "update" : "create"}`)}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryForm;
