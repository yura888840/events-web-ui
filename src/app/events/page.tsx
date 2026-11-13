"use client";

import { Button } from "@/components/ui/button";
import { EventListItem } from "@/modules/events/components/event-list-item";
import { useState } from "react";
import { mockEvents } from "@/modules/events/mocks/events";
import { useRouter } from "next/navigation";

export default function EventsPage() {
  const [events, setEvents] = useState(mockEvents);
  const router = useRouter();

  function toggleEvent(id: string) {
    setEvents((current) =>
      current.map((event) =>
        event.id === id ? { ...event, isActive: !event.isActive } : event,
      ),
    );
  }

  function deleteEvent(id: string) {
    setEvents((current) => current.filter((event) => event.id !== id));
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-semibold">Events</h1>

        <div
          className="mb-6 flex flex-wrap items-center justify-between
            gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4"
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* filters placeholder*/}
          </div>

          <Button type="button" onClick={() => router.push("/events/new")}>
            <span aria-hidden="true">+</span>
            Add new
          </Button>
        </div>

        <ul className="space-y-3">
          {events.map((event) => (
            <EventListItem
              key={event.id}
              event={event}
              onToggle={() => toggleEvent(event.id)}
              onEdit={() =>
                router.push(`/events/${encodeURIComponent(event.id)}`)
              }
              onDelete={() => deleteEvent(event.id)}
            />
          ))}
        </ul>

        {events.length === 0 && (
          <p className="text-gray-500">Событий пока нет.</p>
        )}
      </div>
    </main>
  );
}
