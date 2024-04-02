import { Switch } from "../ui/switch";

const NotificationSettings = () => {
  return (
    <div>
      <div>
        <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
          Notifications:
          <Switch />
        </h2>
        <p className="text-muted-foreground">
          Manage your notification preferences. We'll send you notifications
          only when you set a reminder for them.
        </p>
      </div>
    </div>
  );
};

export default NotificationSettings;
