import SprintWidget from "@/app/components/SprintWidget/SprintWidget";

export default function Page({
  params,
}: {
  params: { teamId: string; sprint: string };
}) {
  return <SprintWidget teamId={params.teamId} sprint={params.sprint} />;
}
