import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { openGenericModal } from "@/app/redux/features/genericModalSlice";
import { useAppDispatch } from "@/app/redux/hooks";
import { SerializedReminder } from "@/app/redux/features/remindersSlice";
import MotionDiv from "./animation/MotionDiv";

interface IReminderCardProps {
  reminder: SerializedReminder;
}

const ReminderCard = ({ reminder }: IReminderCardProps) => {
  const dispatch = useAppDispatch();
  const today = new Date();

  const isPastReminderDate = new Date(reminder.reminderDate) < today;

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
      <div className="w-full flex flex-row md:items-center justify-between">
        <p className="font-semibold">{reminder.title}</p>

        {isPastReminderDate ? (
          <Badge className="w-max mb-2 bg-destructive cursor-pointer select-none">
            Past Reminder Date
          </Badge>
        ) : (
          <Badge className="ml-2 bg-orange-400 cursor-pointer select-none hover:bg-orange-500">
            Reminder
          </Badge>
        )}
      </div>

      <div className="w-full flex items-center gap-1 mt-2">
        <span>Notes:</span>
        <p className="text-primary">{reminder.description}</p>
      </div>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-1">
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
    </MotionDiv>
  );
};
export default ReminderCard;
