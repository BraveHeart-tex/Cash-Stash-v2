import CategoriesPageHeader from "@/components/categories/categories-page-header";
import CategoryCardList from "@/components/categories/category-card-list";
import RoutePaginationControls from "@/components/route-pagination-controls";
import { getPaginatedCategories } from "@/server/category";
import { CategoryType } from "@/server/types";

type CategoriesPageSearchParamsType = {
  page: string;
  query: string;
  type: CategoryType | undefined;
};

type CategoriesPageProps = {
  searchParams: CategoriesPageSearchParamsType;
};

const CategoriesPage = async ({ searchParams }: CategoriesPageProps) => {
  const { query = "", page = "1", type } = searchParams;

  const { categories, ...result } = await getPaginatedCategories({
    query,
    pageNumber: parseInt(page),
    type,
  });

  return (
    <main>
      <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
        <CategoriesPageHeader />
        <CategoryCardList categories={categories} />
      </div>
      {result.totalPages > 1 && <RoutePaginationControls {...result} />}
    </main>
  );
};

export default CategoriesPage;
