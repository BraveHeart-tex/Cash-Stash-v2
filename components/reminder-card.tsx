import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";

import MotionDiv from "./animations/motion-div";
import useGenericModalStore from "@/store/genericModalStore";
import { ReminderSelectModel } from "@/lib/database/schema";

interface IReminderCardProps {
  reminder: ReminderSelectModel;
}

const ReminderCard = ({ reminder }: IReminderCardProps) => {
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal
  );
  const today = new Date();

  const isPastReminderDate = reminder.reminderDate
    ? new Date(reminder.reminderDate) < today
    : false;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      layoutId={`reminder-${reminder.id}`}
      className="flex items-center flex-col gap-1 rounded-md bg-card p-4 shadow-xl relative border"
      key={reminder.id}
    >
      <p className="font-semibold">{reminder.title}</p>

      {reminder.reminderDate && (
        <div className="w-full">
          <p className="text-md text-foreground">
            <span className="font-semibold text-primary">Reminder Date:</span>{" "}
            {new Date(reminder.reminderDate).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
          </p>
        </div>
      )}
      <div className="w-full flex items-center gap-1 mt-2">
        <span className="font-semibold text-primary">Notes:</span>
        <p className="text-foreground">{reminder.description}</p>
      </div>
      <div className="my-2 h-1 bg-card" />
      {/* TODO: Replace with ActionPopover */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-0 right-1 hover:bg-transparent focus:outline-none outline-none"
        aria-label="Edit notification"
        onClick={() => {
          openGenericModal({
            key: "reminder",
            mode: "edit",
            entityId: reminder.id,
            dialogTitle: "Edit Your Reminder",
            data: reminder,
            dialogDescription:
              "Edit the reminder details and click the save button to save the changes.",
          });
        }}
      >
        <Pencil1Icon />
      </Button>
    </MotionDiv>
  );
};
export default ReminderCard;
