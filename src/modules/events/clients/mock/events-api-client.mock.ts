import type { EventDto, UpdateEventDto } from "@yura888840/events-contracts";
import type { EventsApiClient } from "../events-api-client";

export class MockEventsApiClient implements EventsApiClient {
  private readonly events: Map<string, EventDto>;

  constructor(initialEvents: EventDto[]) {
    this.events = new Map(
      initialEvents.map((event) => [event.id, { ...event }]),
    );
  }

  async createEvent(dto: CreateEventDto): Promise<void> {
    const event: EventDto = {
      ...dto,
      id: crypto.randomUUID(),
    };

    this.events.set(event.id, event);
  }

  async updateEvent(id: string, dto: UpdateEventDto): Promise<void> {
    const existing = this.events.get(id);

    if (!existing) {
      throw new Error(`Event "${id}" not found`);
    }

    // Имитируем JSON: поля со значением undefined не отправляются.
    const changes = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value !== undefined),
    );

    this.events.set(id, {
      ...existing,
      ...changes,
    });
  }

  getSnapshot(): EventDto[] {
    return Array.from(this.events.values(), (event) => ({ ...event }));
  }
}
