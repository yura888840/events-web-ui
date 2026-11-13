import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventFormFields } from "./event-form-fields";
const meta = {
  title: "Events/Form fields",
  component: EventFormFields,
  decorators: [
    (Story) => (
      <div className="max-w-2xl text-gray-900">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EventFormFields>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = {};
export const Populated: Story = {
  args: {
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
  },
};
export const Saving: Story = { args: { ...Populated.args, disabled: true } };
