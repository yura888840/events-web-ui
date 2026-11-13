"use client";

import { useState } from "react";
import { mockEvents } from "@/modules/events/mocks/events";
import { useRouter } from "next/navigation";

export default function EventsPage() {
  const [events, setEvents] = useState(mockEvents);
  const router = useRouter();

  function toggleEvent(id: string) {
    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? { ...event, isActive: !event.isActive }
          : event,
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

          <button
            type="button"
            onClick={() => router.push("/events/new")}
            className="inline-flex cursor-pointer items-center gap-2
              rounded-md bg-blue-600 px-4 py-2 text-sm font-medium
              text-white transition-colors hover:bg-blue-700
              focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-blue-600"
          >
            <span aria-hidden="true">+</span>
            Add new
          </button>
        </div>

        <ul className="space-y-3">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex items-center gap-4 rounded-lg border
                border-gray-200 p-4 transition-colors
                hover:bg-gray-200 hover:border-gray-400"
            >
              <h2 className="min-w-0 flex-1 break-words font-medium">
                {event.name}
              </h2>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={event.isActive}
                  aria-label={`Активность события «${event.name}»`}
                  title={event.isActive ? "Деактивировать" : "Активировать"}
                  onClick={() => toggleEvent(event.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0
                    cursor-pointer items-center rounded-full
                    transition-colors focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-blue-600 ${
                      event.isActive ? "bg-blue-600" : "bg-gray-300"
                    }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-4 w-4 rounded-full bg-white
                      transition-transform ${
                        event.isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                  />
                </button>
                <button
                    type="button"
                    aria-label={`Редактировать событие «${event.name}»`}
                    title="Edit"
                    onClick={() => router.push(`/events/${encodeURIComponent(event.id)}`)}
                    className="cursor-pointer rounded-md p-2 text-gray-500
                    transition-colors hover:bg-red-50 hover:text-red-600
                    focus-visible:outline-2 focus-visible:outline-red-600"
                  >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="m16 3 5 5L8 21H3v-5L16 3Z" />
                    <path d="m14 5 5 5" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label={`Delete event «${event.name}»`}
                  title="Удалить"
                  onClick={() => deleteEvent(event.id)}
                  className="cursor-pointer rounded-md p-2 text-gray-500
                    transition-colors hover:bg-red-50 hover:text-red-600
                    focus-visible:outline-2 focus-visible:outline-red-600"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15" />
                    <path d="M10 10v7M14 10v7" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>

        {events.length === 0 && (
          <p className="text-gray-500">Событий пока нет.</p>
        )}
      </div>
    </main>
  );
}