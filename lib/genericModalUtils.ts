import { AppDispatch } from "@/app/redux/store";
import { Page } from "./utils";
import { openGenericModal as openGenericModalAction } from "@/app/redux/features/genericModalSlice";

export const openGenericModal = (
  page: Page,
  dispatch: AppDispatch,
  data?: any
) => {
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

  if (page === "Goals") {
    dispatch(
      openGenericModalAction({
        mode: "create",
        dialogTitle: "Create Goal",
        dialogDescription: "Create a new goal by filling out the form below.",
        entityId: "",
        key: "goal",
      })
    );
  }

  if (page === "Transactions") {
    dispatch(
      openGenericModalAction({
        mode: "create",
        key: "transaction",
        dialogTitle: "Create a transaction",
        dialogDescription: "Fill out the form below to create a transaction.",
        entityId: "",
        props: data,
      })
    );
  }
};
