import ModeToggle from "@/components/ui/mode-toggle";

type ColorThemeSettingsProps = {
  title: string;
  description: string;
};

const ColorThemeSettings = ({
  title,
  description,
}: ColorThemeSettingsProps) => {
  return (
    <section id="color-theme" className="flex flex-col gap-1">
      <div>
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <ModeToggle triggerClassName="w-full md:w-[400px] whitespace-nowrap" />
    </section>
  );
};

export default ColorThemeSettings;
