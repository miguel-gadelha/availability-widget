import SprintHistory from "../components/SprintHistory/SprintHistory";
import TeamContextProvider from "../context/TeamContext";

export default function Page() {
  return (
    <TeamContextProvider>
      <SprintHistory />
    </TeamContextProvider>
  );
}
