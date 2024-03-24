"use server";
import currentRepository from "@/lib/database/repository/currencyRepository";

export const getCurrencies = async () => {
  try {
    return await currentRepository.getCurrencies();
  } catch (error) {
    console.error("Error getting currencies", error);
    return [];
  }
};
