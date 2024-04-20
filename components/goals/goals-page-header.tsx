import CreateGoalButton from "../create-buttons/create-goal-button";

const GoalsPageHeader = () => {
  return (
    <header className="flex items-center justify-between mb-4">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-primary">
        Goals
      </h1>
      <CreateGoalButton className="mt-0" />
    </header>
  );
};

export default GoalsPageHeader;
