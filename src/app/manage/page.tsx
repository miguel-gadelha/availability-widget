import SprintForm from "../components/SprintForm/SprintForm";
import TeamContextProvider from "../context/TeamContext";

export default function Page() {
  return (
    <TeamContextProvider>
      <SprintForm />
    </TeamContextProvider>
  );
}
