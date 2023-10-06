"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchReminders } from "@/app/redux/features/remindersSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { openGenericModal } from "../redux/features/genericModalSlice";

const NotificationsAndReminders = () => {
  const { reminders, isLoading } = useAppSelector(
    (state) => state.remindersReducer
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchReminders());
  }, [dispatch]);

  if (!isLoading && !reminders) {
    return (
      <article className="flex h-[500px] items-center justify-center">
        <div className="mt-[30px]">
          <p className="text-primary">No reminders were found.</p>
          <Button
            className="mt-3 text-md font-semibold"
            onClick={() => {
              dispatch(
                openGenericModal({
                  key: "reminder",
                  mode: "create",
                  dialogTitle: "Create Reminder",
                  dialogDescription:
                    "You can create a reminder by using the form below.",
                  entityId: 0,
                })
              );
            }}
          >
            Create a reminder
          </Button>
        </div>
      </article>
    );
  }

  let today = new Date();

  return (
    <div className="p-2 min-h-[500px] max-h-[500px] overflow-y-scroll scrollbar-hide">
      <div className="grid grid-cols-1 gap-4">
        {reminders &&
          reminders.map((reminder) => (
            <div
              className="flex items-center flex-col gap-1 gp-4 rounded-md bg-card p-4 shadow-xl relative"
              key={reminder.id}
            >
              <div className="w-full flex items-center justify-between">
                <p className="font-bold">{reminder.title}</p>
                <Badge className="ml-2 bg-orange-400 cursor-pointer select-none hover:bg-orange-500">
                  Reminder
                </Badge>
              </div>
              {today < new Date(reminder.reminderDate) ? null : (
                <Badge className="absolute bottom-1 right-1 bg-red-500 cursor-pointer hover:bg-red-600 select-none">
                  PAST REMINDER DATE
                </Badge>
              )}
              <div className="w-full flex items-center gap-1 my-2">
                <span>Notes:</span>
                <p className="text-primary">{reminder.description}</p>
              </div>
              <div className="w-full flex items-center justify-between gap-1">
                <p className="text-md">
                  Date:{" "}
                  {new Date(reminder.reminderDate).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </p>
                <p
                  className={cn(
                    "text-md font-semibold",
                    reminder.isIncome ? "text-green-500" : "text-red-500"
                  )}
                >
                  {reminder.isIncome ? "Income" : "Expense"}: ${reminder.amount}
                </p>
              </div>
              <div className="my-2 h-1 bg-card" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-0 right-1 hover:bg-transparent focus:outline-none outline-none"
                aria-label="Edit notification"
                onClick={() => {
                  dispatch(
                    openGenericModal({
                      key: "reminder",
                      mode: "edit",
                      entityId: reminder.id,
                      dialogTitle: "Edit Reminder",
                      dialogDescription:
                        "You can edit your reminder by using the form below.",
                    })
                  );
                }}
              >
                <Pencil1Icon />
              </Button>
            </div>
          ))}
      </div>
      <Button
        className="mt-3 dark:border dark:border-blue-600"
        onClick={() =>
          dispatch(
            openGenericModal({
              key: "reminder",
              mode: "create",
              dialogTitle: "Create Reminder",
              dialogDescription:
                "You can create a reminder by using the form below.",
              entityId: 0,
            })
          )
        }
      >
        Create a reminder
      </Button>
    </div>
  );
};

export default NotificationsAndReminders;
