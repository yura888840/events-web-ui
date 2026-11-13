import type { CalendarEvent } from "@/components/events-calendar/EventsCalendar";

const KEY = "events-web-ui:advanced-calendar:v1";

export function loadCalendarEvents(initial: CalendarEvent[]): CalendarEvent[] {
  if (typeof window === "undefined") return initial;
  try {
    const saved = localStorage.getItem(KEY);
    if (!saved) return initial;
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return initial;
    return parsed.filter((event): event is CalendarEvent =>
      event !== null && typeof event === "object" &&
      typeof event.id === "string" && typeof event.name === "string" &&
      typeof event.month === "number" && typeof event.day === "number" &&
      typeof event.isActive === "boolean" &&
      (event.type === "birthday" || event.type === "other") &&
      (event.recurrence === "yearly" || event.recurrence === "none")
    );
  } catch {
    return initial;
  }
}

export function saveCalendarEvents(events: CalendarEvent[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(events));
  } catch {
    // Storage can be unavailable in private browsing; the in-memory UI still works.
  }
}
