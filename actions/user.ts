"use server";

import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import userRepository from "@/lib/database/repository/userRepository";
import { redirect } from "next/navigation";

export const updateUserCurrencyPreference = async (symbol: string) => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  if (symbol.length !== 3) {
    return {
      error: "Invalid currency symbol.",
    };
  }

  try {
    const [result] = await userRepository.updateUser(user.id, {
      preferredCurrency: symbol,
    });

    if (!result.affectedRows) {
      return {
        error:
          "An error occurred while updating the currency preference. Please try again later.",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("error updating currency preference", error);
    return {
      error:
        "An error occurred while updating the currency preference. Please try again later.",
    };
  }
};
