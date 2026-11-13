import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className="text-gray-900">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  parameters: {
    nextjs: { appDirectory: true },
    layout: "padded",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: { options: { light: { name: "Light", value: "#ffffff" } } },
  },
  initialGlobals: { backgrounds: { value: "light" } },
};
export default preview;
