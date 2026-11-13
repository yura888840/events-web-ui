import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input, Textarea, Select, Checkbox } from "./form-controls";
const meta = {
  title: "UI/Form controls",
  component: Input,
  args: { "aria-label": "Название", placeholder: "Название события" },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Text: Story = {};
export const Number: Story = {
  args: {
    type: "number",
    min: 1,
    max: 31,
    "aria-label": "День",
    placeholder: "День",
  },
};
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Событие" },
};
export const Description: Story = {
  render: () => (
    <label>
      Описание
      <Textarea rows={4} defaultValue="Подготовить подарок" />
    </label>
  ),
};
export const EventType: Story = {
  render: () => (
    <label>
      Тип события
      <Select defaultValue="birthday">
        <option value="birthday">День рождения</option>
        <option value="other">Другое</option>
      </Select>
    </label>
  ),
};
export const ActiveCheckbox: Story = {
  render: () => (
    <label className="flex items-center gap-3">
      <Checkbox defaultChecked />
      Событие активно
    </label>
  ),
};
