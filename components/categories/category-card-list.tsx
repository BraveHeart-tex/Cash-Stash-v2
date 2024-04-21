import { CategorySelectModel } from "@/lib/database/schema";
import CategoryCard from "@/components/categories/category-card";

type CategoryCardListProps = {
  categories: CategorySelectModel[];
};
const CategoryCardList = ({ categories }: CategoryCardListProps) => {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
};

export default CategoryCardList;
