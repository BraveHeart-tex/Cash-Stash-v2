import CategoryCard from "@/components/categories/category-card";
import type { CategorySelectModel } from "@/lib/database/schema";

type CategoryCardListProps = {
  categories: CategorySelectModel[];
};
const CategoryCardList = ({ categories }: CategoryCardListProps) => {
  return (
    <div className="mt-2 h-[calc(100vh-510px)] w-full overflow-auto pr-2 lg:h-[calc(100vh-450px)]">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryCardList;
