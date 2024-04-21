import CreateGoalButton from "@/components/create-buttons/create-goal-button";

const GoalsPageHeader = () => {
  return (
    <header className="mb-4 flex items-center justify-between">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary">
        Goals
      </h1>
      <CreateGoalButton minimizeOnMobile />
    </header>
  );
};

export default GoalsPageHeader;
