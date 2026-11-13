import { AdvancedCalendar } from "@/modules/events/calendar/AdvancedCalendar";
import { mockEvents } from "@/modules/events/mocks/events";
import type { CalendarEvent } from "@/components/events-calendar/EventsCalendar";

const initialEvents: CalendarEvent[] = mockEvents.map((event) => ({
  id: event.id,
  name: event.name,
  description: event.description,
  year: event.year,
  month: event.month,
  day: event.day,
  type: event.type,
  recurrence: event.recurrence,
  isActive: event.isActive,
  category: "personal",
}));

export default function EventsCalendarPage() {
  return <AdvancedCalendar initialEvents={initialEvents} />;
}
