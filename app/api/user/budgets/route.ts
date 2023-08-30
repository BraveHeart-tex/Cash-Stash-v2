import { NextResponse } from "next/server";
import getCurrentUserBudgets from "@/app/actions/getCurrentUserBudgets";
import getCurrentUser from "@/app/actions/getCurrentUser";
import createBudget from "@/app/actions/createBudget";
import { NotificationCategory, Budget } from "@prisma/client";
import CreateBudgetOptions from "@/app/utils/CreateBudgetOptions";
import { getCurrentUserAction } from "@/actions";

// @desc GET all budgets
// @route GET /api/user/budgets
// @access Private
export async function GET(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const budgets = await getCurrentUserBudgets(currentUser);

  if (!budgets || budgets.length === 0) {
    return NextResponse.json(
      { error: "No budgets found for current user." },
      { status: 404 }
    );
  }

  return NextResponse.json({ budgets: budgets }, { status: 200 });
}

// @desc Create a budget
// @route POST /api/user/budgets
// @access Private
export async function POST(request: Request) {
  const { user: currentUser } = await getCurrentUserAction();
  const { budgetAmount, spentAmount, category } = await request.json();

  if (!currentUser) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const mappedCategory = Object.entries(CreateBudgetOptions).find(
    ([key, value]) => value === category
  )?.[0];

  const createdBudget = await createBudget(
    budgetAmount,
    spentAmount,
    mappedCategory as NotificationCategory,
    currentUser.id
  );

  if (typeof createdBudget !== "object" || "error" in createdBudget) {
    // The createdBudget is not of type Budget or it contains an error property
    return NextResponse.json(
      {
        error: createdBudget.error,
      },
      {
        status: 400,
      }
    );
  }

  if (!createdBudget) {
    return NextResponse.json(
      { error: "Could not create budget for current user." },
      { status: 500 }
    );
  }

  return NextResponse.json({ budget: createdBudget }, { status: 200 });
}
