import Header from "../components/Header/Header";
import SprintHistory from "../components/SprintHistory/SprintHistory";
import TeamContextProvider from "../context/TeamContext";

export default function Page() {
  return (
    <section className="flex flex-col w-full h-screen items-center">
      <TeamContextProvider>
        <Header className="mb-12" />
      </TeamContextProvider>
      <SprintHistory />
    </section>
  );
}
