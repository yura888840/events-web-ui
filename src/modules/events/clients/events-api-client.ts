import type {
  updateEventDtoSchema,
  CreateEventDto,
} from "@yura888840/events-contracts";

// Infer from the update schema: the contracts package currently aliases
// UpdateEventDto to the full EventDto (including id).
export type UpdateEventInput = ReturnType<typeof updateEventDtoSchema.parse>;

export interface EventsApiClient {
  // getEvents()
  // getEventById(id)
  // deleteEvent(id)
  createEvent(dto: CreateEventDto): Promise<void>;
  updateEvent(id: string, dto: UpdateEventInput): Promise<void>;
}
