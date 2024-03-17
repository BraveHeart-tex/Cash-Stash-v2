import CreateBudgetButton from "@/components/create-buttons/create-budget-button";
import MotionDiv from "@/components/animations/motion-div";
import { BudgetCategory } from "@prisma/client";
import RouteSearchInput from "@/components/route-search-input";
import BudgetCard from "@/components/budget-card";
import RouteSelectFilter from "@/components/route-select-filter";
import RouteFiltersPopover from "@/components/route-filters-popover";
import { GiPayMoney } from "react-icons/gi";
import { FaPiggyBank } from "react-icons/fa";
import BudgetsNotFoundMessage from "./budgets-not-found";
import { BudgetSelectModel } from "@/lib/database/schema";
import { generateReadbleEnumLabels } from "@/lib/utils/stringUtils/generateReadbleEnumLabels";

const BudgetList = ({
  budgets,
  pageHasParams,
}: {
  budgets: BudgetSelectModel[];
  pageHasParams: boolean;
}) => {
  const selectDataset = generateReadbleEnumLabels({ enumObj: BudgetCategory });

  return (
    <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <div className="flex w-full items-center justify-between mb-4">
        <h3 className="text-4xl text-primary">Budgets</h3>
        <CreateBudgetButton className="mt-0" />
      </div>
      <div className="flex items-center gap-2 justify-between">
        <RouteSearchInput placeholder="Search budgets by name" />
        {budgets.length > 1 && (
          <RouteFiltersPopover
            options={[
              {
                label: "Sort by Remaining (Low to High)",
                icon: <FaPiggyBank className="mr-2" />,
                data: {
                  sortBy: "progress",
                  sortDirection: "desc",
                },
              },
              {
                label: "Sort by Remaining (High to Low)",
                icon: <FaPiggyBank className="mr-2" />,
                data: {
                  sortBy: "progress",
                  sortDirection: "asc",
                },
              },
              {
                label: "Sort by Spending (High to Low)",
                icon: <GiPayMoney className="mr-auto" />,
                data: {
                  sortBy: "spentAmount",
                  sortDirection: "desc",
                },
              },
              {
                label: "Sort by Spending (Low to High)",
                icon: <GiPayMoney className="mr-auto" />,
                data: {
                  sortBy: "spentAmount",
                  sortDirection: "asc",
                },
              },
              {
                label: "Sort by Budget (High to Low)",
                icon: <FaPiggyBank className="mr-2" />,
                data: {
                  sortBy: "budgetAmount",
                  sortDirection: "desc",
                },
              },
              {
                label: "Sort by Budget (Low to High)",
                icon: <FaPiggyBank className="mr-2" />,
                data: {
                  sortBy: "budgetAmount",
                  sortDirection: "asc",
                },
              },
            ]}
            queryKeys={["sortBy", "sortDirection"]}
          />
        )}
      </div>
      <div className={"grid lg:grid-cols-6"}>
        <RouteSelectFilter
          dataset={selectDataset}
          queryStringKey="category"
          selectLabel="Budget Category"
        />
        {budgets.length === 0 ? (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.5, type: "just" }}
            className="lg:text-center lg:col-span-6 col-span-6 mt-4 w-full"
          >
            <BudgetsNotFoundMessage pageHasParams={pageHasParams} />
          </MotionDiv>
        ) : (
          <div className="h-[500px] lg:pr-4 col-span-5 mt-2 lg:mt-0 overflow-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4 pr-2">
              {budgets.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetList;
