import type {
  EventDto,
  EventType,
  EventRecurrence,
} from "@yura888840/events-contracts";

export type EventFormValues = {
  name: string;
  description: string;
  year: string;
  month: string;
  day: string;
  type: EventType;
  recurrence: EventRecurrence;
  isActive: boolean;
};

export function eventDtoToFormValues(event: EventDto): EventFormValues {
  return {
    name: event.name,
    description: event.description,
    year: event.year === undefined ? "" : String(event.year),
    month: String(event.month),
    day: String(event.day),
    type: event.type,
    recurrence: event.recurrence,
    isActive: event.isActive,
  };
}
