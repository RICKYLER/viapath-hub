import { createFileRoute } from "@tanstack/react-router";

import { WorkerProfilePage } from "@/pages/WorkerProfilePage";

export const Route = createFileRoute("/client/workers/$workerId")({
  component: WorkerProfileRoute,
});

function WorkerProfileRoute() {
  const { workerId } = Route.useParams();
  return <WorkerProfilePage workerId={workerId} />;
}
