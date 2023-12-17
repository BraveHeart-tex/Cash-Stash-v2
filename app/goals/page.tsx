import { getGenericListByCurrentUser } from "@/actions/generic";
import GoalsPageClient from "./GoalsPageClient";
import { SerializedGoal } from "../redux/features/goalSlice";

const GoalsPage = async () => {
  const result = await getGenericListByCurrentUser<SerializedGoal>({
    tableName: "goal",
  });

  return (
    <main>
      <GoalsPageClient goals={result?.data || []} />
    </main>
  );
};

export default GoalsPage;
