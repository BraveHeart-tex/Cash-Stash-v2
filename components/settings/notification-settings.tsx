import { Switch } from "@/components/ui/switch";

type NotificationSettingsProps = {
  title: string;
  description: string;
};

const NotificationSettings = ({
  title,
  description,
}: NotificationSettingsProps) => {
  return (
    <section id="notifications">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-primary">
        {title}:
        <Switch />
      </h2>
      <p className="text-muted-foreground">{description}</p>
    </section>
  );
};

export default NotificationSettings;
