import SettingsList from "@/components/settings/settings-list";

const SettingsPage = () => {
  return (
    <div>
      <div className="rounded-md p-2 lg:p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px] mb-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-4xl text-primary">Settings</h3>
          <p className="text-muted-foreground">
            You manage your preferences and settings here.
          </p>
        </div>
        <div className="mt-10">
          <SettingsList />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
