import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { EventsCalendar } from "./EventsCalendar";
const meta = {
  title: "Events/Calendar",
  component: EventsCalendar,
  parameters: { layout: "fullscreen" },
  args: {
    initialDate: new Date(2026, 10, 13),
    events: [
      {
        id: "1",
        name: "День рождения Анны",
        description: "Подготовить подарок",
        day: 13,
        month: 11,
        type: "birthday",
        recurrence: "yearly",
        isActive: true,
      },
      {
        id: "2",
        name: "Встреча команды",
        description: "Обсудить проект",
        day: 16,
        month: 11,
        year: 2026,
        type: "other",
        category: "work",
        time: "10:00",
        recurrence: "none",
        isActive: true,
      },
    ],
  },
} satisfies Meta<typeof EventsCalendar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Month: Story = {};
export const Empty: Story = { args: { events: [] } };
export const Search: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Найти событие" }),
      "Анны",
    );
    await expect(
      canvas.getByRole("button", { name: "День рождения Анны" }),
    ).toBeVisible();
    await expect(
      canvas.queryByRole("button", { name: /Встреча команды/ }),
    ).not.toBeInTheDocument();
  },
};
export const Details: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "День рождения Анны" }),
    );
    await expect(canvas.getByRole("dialog")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Закрыть" }));
    await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
  },
};
export const Week: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", {
      name: "Неделя",
    });
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-pressed", "true");
  },
};
