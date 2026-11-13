import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FormFeedback } from "./form-feedback";
const meta = {
  title: "UI/Form feedback",
  component: FormFeedback,
} satisfies Meta<typeof FormFeedback>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Errors: Story = {
  args: { errors: ["name: Укажите название", "day: Укажите корректный день"] },
};
export const Success: Story = {
  args: { success: "Изменения сохранены в памяти мока." },
};
