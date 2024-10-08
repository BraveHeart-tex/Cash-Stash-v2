import ActionPopover from "@/components/action-popover";
import MotionDiv from "@/components/animations/motion-div";
import type { ReminderSelectModel } from "@/lib/database/schema";
import useGenericModalStore from "@/store/genericModalStore";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";

type ReminderCardProps = {
  reminder: ReminderSelectModel;
};

const ReminderCard = ({ reminder }: ReminderCardProps) => {
  const openGenericModal = useGenericModalStore(
    (state) => state.openGenericModal,
  );

  const handleEditReminder = () => {
    openGenericModal({
      key: "reminder",
      mode: "edit",
      entityId: reminder.id,
      dialogTitle: "Edit Your Reminder",
      data: reminder,
      dialogDescription:
        "Edit the reminder details and click the save button to save the changes.",
    });
  };

  const handleDeleteReminder = () => {};

  const handleMarkAsRead = () => {};

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      layoutId={`reminder-${reminder.id}`}
      className="relative flex flex-col items-center gap-1 rounded-md border bg-card p-4 shadow-sm"
      key={reminder.id}
    >
      <p className="mb-2 self-start font-semibold">{reminder.title}</p>

      {reminder.reminderDate && (
        <div className="w-full">
          <p className="text-foreground">
            <span className="font-semibold text-primary">Reminder Date:</span>{" "}
            {new Date(reminder.reminderDate).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
          </p>
        </div>
      )}
      <div className="mt-2 flex w-full items-center gap-1">
        <span className="font-semibold text-primary">Notes:</span>
        <p className="text-foreground">{reminder.description}</p>
      </div>
      <div className="my-2 h-1 bg-card" />
      <ActionPopover
        heading="Reminder Actions"
        positionAbsolute
        triggerClassName="absolute top-0 right-1 hover:bg-transparent focus:outline-none outline-none"
        options={[
          {
            label: "Mark as read",
            icon: FaCheck,
            onClick: handleMarkAsRead,
          },
          {
            label: "Edit",
            icon: FaEdit,
            onClick: handleEditReminder,
          },
          {
            label: "Delete",
            icon: FaTrash,
            onClick: handleDeleteReminder,
          },
        ]}
      />
    </MotionDiv>
  );
};
export default ReminderCard;
