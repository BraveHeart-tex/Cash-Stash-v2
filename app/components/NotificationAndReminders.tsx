"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchReminders } from "@/app/redux/features/remindersSlice";
import { Button } from "@/components/ui/button";
import { openGenericModal } from "../redux/features/genericModalSlice";
import { FaRegClock } from "react-icons/fa";
import ReminderCard from "@/components/ReminderCard";

const NotificationsAndReminders = () => {
  const { reminders, isLoading } = useAppSelector(
    (state) => state.remindersReducer
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchReminders());
  }, [dispatch]);

  if (!isLoading && !reminders?.length) {
    return (
      <article className="flex h-[500px] items-center justify-center">
        <div className="mt-[30px]">
          <p className="text-primary">No reminders were found.</p>
          <Button
            className="mt-3 text-md font-semibold flex items-center gap-[14px]"
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
            <FaRegClock size={18} />
            Create a reminder
          </Button>
        </div>
      </article>
    );
  }

  return (
    <div className="p-2 min-h-[500px] max-h-[500px] overflow-y-scroll scrollbar-hide">
      <div className="grid grid-cols-1 gap-4">
        {reminders &&
          reminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))}
      </div>
      <Button
        className="mt-3"
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
