# EventsCalendar

React + TypeScript client component for Next.js App Router. No API calls.

## Install

npm install lucide-react

Copy EventsCalendar.tsx and EventsCalendar.css into src/components/events-calendar/.

```tsx
import { EventsCalendar, type CalendarEvent } from '@/components/events-calendar/EventsCalendar';

const events: CalendarEvent[] = [
  { id: '1', name: 'День рождения', description: '', month: 10, day: 24,
    type: 'birthday', recurrence: 'yearly', isActive: true },
];

export default function Page() {
  return <EventsCalendar events={events} />;
}
```

Optional initialDate sets the initially displayed date. example-page.tsx contains the original demo (October 2026).

month: 1–12. Non-recurring events require year. Inactive events are hidden.
Optional time: HH:mm, category: work | personal. Input events are never mutated.
Week starts Monday. Selecting a month opens the week containing its first day.
Yearly February 29 events appear only in leap years.

Includes the complete mockup shell, sidebar, search, category filters and event details.
Week view displays day columns, not a timed hourly grid. Navigation uses arrow buttons.
CSS is scoped to .events-calendar-root; no Tailwind or remote fonts required.
