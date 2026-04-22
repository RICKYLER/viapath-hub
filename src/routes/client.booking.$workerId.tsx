import { createFileRoute } from "@tanstack/react-router";

import { BookingPage } from "@/pages/BookingPage";

export const Route = createFileRoute("/client/booking/$workerId")({
  component: BookingRoute,
});

function BookingRoute() {
  const { workerId } = Route.useParams();
  return <BookingPage workerId={workerId} />;
}
