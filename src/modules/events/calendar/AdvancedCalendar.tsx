"use client";

import { useEffect, useState } from "react";
import {
  EventsCalendar,
  type CalendarEvent,
} from "@/components/events-calendar/EventsCalendar";
import { loadCalendarEvents, saveCalendarEvents } from "./event-store";

type Props = { initialEvents: CalendarEvent[] };

export function AdvancedCalendar({ initialEvents }: Props) {
  const [events, setEvents] = useState(initialEvents);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEvents(loadCalendarEvents(initialEvents));
    setLoaded(true);
  }, [initialEvents]);

  function updateEvents(updater: (current: CalendarEvent[]) => CalendarEvent[]) {
    setEvents((current) => {
      const next = updater(current);
      saveCalendarEvents(next);
      return next;
    });
  }

  return (
    <EventsCalendar
      events={events}
      onCreate={(event) => updateEvents((current) => [...current, event])}
      onUpdate={(event) =>
        updateEvents((current) => current.map((item) => item.id === event.id ? event : item))
      }
      onDelete={(id) =>
        updateEvents((current) => current.filter((event) => event.id !== id))
      }
      storageReady={loaded}
    />
  );
}
