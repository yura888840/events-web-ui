import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { EventListItem } from "./event-list-item";
const meta = {
  title: "Events/List item",
  component: EventListItem,
  decorators: [
    (Story) => (
      <ul className="max-w-2xl text-gray-900">
        <Story />
      </ul>
    ),
  ],
  args: {
    event: { name: "День рождения", isActive: true },
    onToggle: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof EventListItem>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Active: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("switch"));
    await expect(args.onToggle).toHaveBeenCalledOnce();
    await userEvent.click(
      canvas.getByRole("button", { name: /Редактировать/ }),
    );
    await expect(args.onEdit).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", { name: /Delete event/ }));
    await expect(args.onDelete).toHaveBeenCalledOnce();
  },
};
export const Inactive: Story = {
  args: { event: { name: "Встреча", isActive: false } },
};
export const LongName: Story = {
  args: {
    event: {
      name: "Очень длинное название события, которое должно переноситься и оставлять действия доступными",
      isActive: true,
    },
  },
};
