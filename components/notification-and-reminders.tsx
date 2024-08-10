"use client";
import AnimatePresenceClient from "@/components/animations/animate-presence";
import MotionDiv from "@/components/animations/motion-div";
import ReminderCard from "@/components/reminder-card";
import { Button } from "@/components/ui/button";
import type { ReminderSelectModel } from "@/lib/database/schema";
import useGenericModalStore from "@/store/genericModalStore";
import { FaRegClock } from "react-icons/fa";

const NotificationsAndReminders = ({
  reminders,
}: {
  reminders: ReminderSelectModel[];
}) => {
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal,
  );

  const noRemindersState = () => (
    <article className="flex h-[500px] items-center justify-center">
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-[30px]"
      >
        <p className="text-primary">No reminders were found.</p>
        <Button
          className="mt-3 flex items-center gap-[14px] font-semibold"
          onClick={() => {
            openGenericModal({
              key: "reminder",
              mode: "create",
              dialogTitle: "Create Reminder",
              dialogDescription:
                "Set a reminder for a specific date and time to help you remember important events.",
              entityId: "",
            });
          }}
        >
          <FaRegClock size={18} />
          Create a reminder
        </Button>
      </MotionDiv>
    </article>
  );

  if (!reminders.length) return noRemindersState();

  return (
    <div className="max-h-[500px] min-h-[500px] overflow-y-auto pr-2">
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresenceClient>
          {reminders.length > 0
            ? reminders.map((reminder) => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))
            : noRemindersState()}
        </AnimatePresenceClient>
      </div>
      <Button
        className="mt-3"
        onClick={() =>
          openGenericModal({
            key: "reminder",
            mode: "create",
            dialogTitle: "Create Reminder",
            dialogDescription:
              "You can create a reminder by using the form below.",
            entityId: "",
          })
        }
      >
        Create a reminder
      </Button>
    </div>
  );
};

export default NotificationsAndReminders;
