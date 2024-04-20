import { Switch } from "@/components/ui/switch";

const NotificationSettings = () => {
  return (
    <section id="notifications">
      <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
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
