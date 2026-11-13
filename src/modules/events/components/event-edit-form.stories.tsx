import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import EventEditForm from "./event-edit-form";
const meta = {
  title: "Events/Edit form",
  component: EventEditForm,
  decorators: [
    (Story) => (
      <div className="max-w-2xl text-gray-900">
        <Story />
      </div>
    ),
  ],
  args: {
    eventId: "1",
    initialValues: {
      name: "День рождения",
      description: "Подготовить подарок",
      day: "4",
      month: "7",
      year: "1990",
      type: "birthday",
      recurrence: "yearly",
      isActive: true,
    },
    apiClient: {
      createEvent: fn(async () => {}),
      updateEvent: fn(async () => {}),
    },
  },
} satisfies Meta<typeof EventEditForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Saved: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.clear(canvas.getByLabelText("Название"));
    await userEvent.type(canvas.getByLabelText("Название"), "Updated event");
    await userEvent.click(canvas.getByRole("button", { name: "Сохранить" }));
    await expect(await canvas.findByRole("status")).toBeVisible();
    await expect(args.apiClient!.updateEvent).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({
        name: "Updated event",
        day: 4,
        month: 7,
        year: 1990,
      }),
    );
  },
};
export const Saving: Story = {
  args: {
    apiClient: {
      createEvent: fn(async () => {}),
      updateEvent: fn(() => new Promise<void>(() => {})),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Сохранить" }));
    await expect(
      canvas.getByRole("button", { name: "Сохранение..." }),
    ).toBeDisabled();
    await expect(canvas.getByLabelText("Название")).toBeDisabled();
  },
};
