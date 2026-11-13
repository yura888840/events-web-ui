import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button, ButtonLink } from "./button";
const meta = {
  title: "UI/Button",
  component: Button,
  args: { children: "Add new", onClick: fn() },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button"));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
export const Submit: Story = {
  args: { variant: "submit", type: "submit", children: "Сохранить" },
};
export const Secondary: Story = {
  args: { variant: "secondary", children: "Отмена" },
};
export const Disabled: Story = {
  args: { disabled: true, children: "Сохранение..." },
};
export const Icon: Story = {
  args: { variant: "icon", children: "×", "aria-label": "Delete event" },
};
export const NavigationLink: Story = {
  render: () => <ButtonLink href="/events">← Back to list</ButtonLink>,
};
