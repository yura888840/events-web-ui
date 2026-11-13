import Link from "next/link";

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
          <Link
            href="/events"
            className="inline-flex items-center gap-2
              rounded-md bg-blue-600 px-4 py-2 text-sm font-medium
              text-white transition-colors hover:bg-blue-700
              focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-blue-600"
          >
            <span aria-hidden="true">←</span>
            Back to list
          </Link>
        </div>

        <EventCreateForm />
      </div>
    </main>
  );
}