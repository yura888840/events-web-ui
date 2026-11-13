import {
  EventsCalendar,
  type CalendarEvent,
} from "@/components/events-calendar/EventsCalendar";

const events: CalendarEvent[] = [
  {
    id: "1",
    name: "День рождения",
    description: "Купить подарок",
    month: 10,
    day: 24,
    type: "birthday",
    recurrence: "yearly",
    isActive: true,
  },
];

export default function EventsPage() {
  return <EventsCalendar events={events} />;
}