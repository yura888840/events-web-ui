import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Switch } from "./switch";
const meta = {
  title: "UI/Switch",
  component: Switch,
  args: {
    checked: true,
    "aria-label": "Событие активно",
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const On: Story = {};
export const Off: Story = { args: { checked: false } };
export const Disabled: Story = { args: { disabled: true } };
export const Interactive: Story = {
  render: function InteractiveSwitch(args) {
    const [checked, setChecked] = useState(args.checked);
    return (
      <Switch
        {...args}
        checked={checked}
        onCheckedChange={(value) => {
          setChecked(value);
          args.onCheckedChange(value);
        }}
      />
    );
  },
  play: async ({ canvasElement, args }) => {
    const control = within(canvasElement).getByRole("switch");
    await userEvent.click(control);
    await expect(control).toHaveAttribute("aria-checked", "false");
    await expect(args.onCheckedChange).toHaveBeenCalledWith(false);
    await userEvent.keyboard(" ");
    await expect(control).toHaveAttribute("aria-checked", "true");
  },
};
