import CategoriesNotFoundMessage from "@/components/categories/categories-not-found-message";
import CategoriesPageFilters from "@/components/categories/categories-page-filters";
import CategoriesPageHeader from "@/components/categories/categories-page-header";
import CategoryCardList from "@/components/categories/category-card-list";
import RoutePaginationControls from "@/components/route-pagination-controls";
import { getPaginatedCategories } from "@/server/category";
import type { CategoryType } from "@/typings/categories";

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
    pageNumber: Number.parseInt(page),
    type,
  });

  const pageHasParams = Object.values(searchParams).some(
    (param) => param !== "",
  );

  return (
    <main>
      <div className="mx-auto space-y-2 p-4 lg:max-w-[1300px] xl:max-w-[1600px]">
        <CategoriesPageHeader />
        <CategoriesPageFilters />
        {categories.length === 0 ? (
          <CategoriesNotFoundMessage pageHasParams={pageHasParams} />
        ) : null}
        <CategoryCardList categories={categories} />
      </div>
      {result.totalPages > 1 && <RoutePaginationControls {...result} />}
    </main>
  );
};

export default CategoriesPage;
