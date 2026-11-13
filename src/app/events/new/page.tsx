import { ButtonLink } from "@/components/ui/button";

import EventCreateForm from "@/modules/events/components/event-create-form";

export default function NewEventPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-semibold">New event</h1>

        <div
          className="mb-6 flex flex-wrap items-center justify-end
            gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4"
        >
          <ButtonLink href="/events">
            <span aria-hidden="true">←</span>
            Back to list
          </ButtonLink>
        </div>

        <EventCreateForm />
      </div>
    </main>
  );
}
