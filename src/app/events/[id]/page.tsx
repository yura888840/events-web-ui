import { ButtonLink } from "@/components/ui/button";
import { notFound } from "next/navigation";

import { mockEvents } from "@/modules/events/mocks/events";
import { eventDtoToFormValues } from "@/modules/events/model/event-form";
import EventEditForm from "@/modules/events/components/event-edit-form";

type EditEventPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventEditPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const event = mockEvents.find((event) => event.id === id);

  if (!event) {
    notFound();
  }

  const initialValues = eventDtoToFormValues(event);

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-semibold">Edit event</h1>

        <div
          className="mb-6 flex flex-wrap items-center justify-end
            gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4"
        >
          <ButtonLink href="/events">
            <span aria-hidden="true">←</span>
            Back to list
          </ButtonLink>
        </div>

        <EventEditForm
          key={event.id}
          eventId={event.id}
          initialValues={initialValues}
        />
      </div>
    </main>
  );
}
