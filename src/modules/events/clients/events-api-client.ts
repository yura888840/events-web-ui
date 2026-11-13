import type {
  UpdateEventDto,
  CreateEventDto,
} from "@yura888840/events-contracts";

export interface EventsApiClient {
  // getEvents()
  // getEventById(id)
  // deleteEvent(id)
  createEvent(dto: CreateEventDto): Promise<void>;
  updateEvent(id: string, dto: UpdateEventDto): Promise<void>;
}
