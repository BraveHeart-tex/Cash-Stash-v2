import { AppDispatch } from "@/app/redux/store";
import { Page } from "./utils";
import { openGenericModal as openGenericModalAction } from "@/app/redux/features/genericModalSlice";

export const openGenericModal = (page: Page, dispatch: AppDispatch) => {
  if (page === "Accounts") {
    dispatch(
      openGenericModalAction({
        mode: "create",
        key: "account",
        dialogTitle: "Create an account",
        dialogDescription: "Fill out the form below to create an account.",
        entityId: "",
      })
    );
  }

  if (page === "Budgets") {
    dispatch(
      openGenericModalAction({
        mode: "create",
        key: "budget",
        dialogTitle: "Create a budget",
        dialogDescription: "Fill out the form below to create a budget.",
        entityId: "",
      })
    );
  }
};
