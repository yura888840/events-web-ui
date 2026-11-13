import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import EventCreateForm from "./event-create-form";
const meta = {
  title: "Events/Create form",
  component: EventCreateForm,
  decorators: [
    (Story) => (
      <div className="max-w-2xl text-gray-900">
        <Story />
      </div>
    ),
  ],
  args: {
    apiClient: {
      createEvent: fn(async () => {}),
      updateEvent: fn(async () => {}),
    },
  },
} satisfies Meta<typeof EventCreateForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ValidationErrors: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Создать" }));
    await expect(canvas.getByRole("alert")).toBeVisible();
    await expect(args.apiClient!.createEvent).not.toHaveBeenCalled();
  },
};
export const Saved: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Название"), "Team meeting");
    await userEvent.type(canvas.getByLabelText("День"), "12");
    await userEvent.type(canvas.getByLabelText("Месяц"), "11");
    await userEvent.click(canvas.getByRole("button", { name: "Создать" }));
    await expect(await canvas.findByRole("status")).toBeVisible();
    await expect(args.apiClient!.createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Team meeting",
        day: 12,
        month: 11,
        isActive: true,
      }),
    );
    await expect(canvas.getByLabelText("Название")).toHaveValue("");
  },
};
export const ApiFailure: Story = {
  args: {
    apiClient: {
      createEvent: fn(async () => {
        throw new Error("Сервис недоступен");
      }),
      updateEvent: fn(async () => {}),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Название"), "Team meeting");
    await userEvent.type(canvas.getByLabelText("День"), "12");
    await userEvent.type(canvas.getByLabelText("Месяц"), "11");
    await userEvent.click(canvas.getByRole("button", { name: "Создать" }));
    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      "Сервис недоступен",
    );
    await expect(canvas.getByLabelText("Название")).toHaveValue("Team meeting");
  },
};
