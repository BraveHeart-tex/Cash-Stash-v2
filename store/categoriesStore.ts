import { CategorySelectModel } from "@/lib/database/schema";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type CategoriesStoreState = {
  categories: CategorySelectModel[];
  // eslint-disable-next-line no-unused-vars
  setCategories: (categories: CategorySelectModel[]) => void;
  // eslint-disable-next-line no-unused-vars
  addCategory: (category: CategorySelectModel) => void;
  // eslint-disable-next-line no-unused-vars
  removeCategory: (category: CategorySelectModel) => void;
  // eslint-disable-next-line no-unused-vars
  updateCategory: (category: CategorySelectModel) => void;
};

const useCategoriesStore = create<
  CategoriesStoreState,
  [["zustand/devtools", never]]
>(
  devtools((set, get) => ({
    categories: [],
    setCategories: (categories) => {
      set({ categories });
    },
    addCategory: (category) => {
      const { categories } = get();
      set({ categories: [...categories, category] });
    },
    removeCategory: (category) => {
      const { categories } = get();
      set({ categories: categories.filter((c) => c.id !== category.id) });
    },
    updateCategory: (category) => {
      const { categories } = get();
      set({
        categories: categories.map((c) =>
          c.id === category.id ? category : c
        ),
      });
    },
  }))
);

export default useCategoriesStore;
