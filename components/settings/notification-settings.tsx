import { Switch } from "@/components/ui/switch";

const NotificationSettings = () => {
  return (
    <section id="notifications">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-primary">
        Notifications:
        <Switch />
      </h2>
      <p className="text-muted-foreground">
        Manage your notification preferences. We'll send you notifications only
        when you set a reminder for them.
      </p>
    </section>
  );
};

export default NotificationSettings;
