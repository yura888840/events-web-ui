import type { EventDto } from "@yura888840/events-contracts";

export const mockEvents: EventDto[] = [
  {
    id: "1",
    name: "День рождения",
    description: "Подготовить подарок",
    year: 1990,
    month: 7,
    day: 4,
    type: "birthday",
    recurrence: "yearly",
    isActive: true,
  },
  {
    id: "2",
    name: "Встреча",
    description: "Обсудить проект",
    year: 2026,
    month: 11,
    day: 10,
    type: "other",
    recurrence: "none",
    isActive: true,
  },
];
