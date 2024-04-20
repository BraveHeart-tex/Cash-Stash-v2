import ModeToggle from "@/components/ui/mode-toggle";

const ColorThemeSettings = () => {
  return (
    <section id="color-theme" className="flex flex-col gap-1">
      <div>
        <h2 className="text-xl font-semibold text-primary">Color Theme</h2>
        <p className="text-muted-foreground">
          Choose your preferred color theme.
        </p>
      </div>
      <ModeToggle triggerClassName="w-full md:w-[400px] whitespace-nowrap" />
    </section>
  );
};

export default ColorThemeSettings;
