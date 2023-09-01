"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setIsCreateReminderModalOpen } from "@/app/redux/features/remindersSlice";
import { fetchReminders } from "@/app/redux/features/remindersSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { openGenericModal } from "../redux/features/genericModalSlice";

const NotificationsAndReminders = () => {
  const { isCreateReminderModalOpen, reminders, isLoading } = useAppSelector(
    (state) => state.remindersReducer
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchReminders());
  }, [dispatch]);

  if (!isLoading && !reminders) {
    return (
      <div className="p-2 h-[700px] overflow-y-scroll scrollbar-hide">
        <p>No reminders were found.</p>
        <Button
          variant="secondary"
          className="mt-3 dark:border text-md dark:border-blue-600 bg-secondary hover:bg-secondary-foreground font-bold hover:text-secondary"
          onClick={() => {
            dispatch(setIsCreateReminderModalOpen(!isCreateReminderModalOpen));
          }}
        >
          Create a reminder
        </Button>
      </div>
    );
  }

  let today = new Date();

  return (
    <div className="p-2 h-[700px] overflow-y-scroll scrollbar-hide">
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
          dispatch(setIsCreateReminderModalOpen(!isCreateReminderModalOpen))
        }
      >
        Create a reminder
      </Button>
    </div>
  );
};

export default NotificationsAndReminders;
