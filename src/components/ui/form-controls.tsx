import type { ComponentProps } from "react";

const controlClasses =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 disabled:cursor-not-allowed disabled:opacity-50";
export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return <input className={`${controlClasses} ${className}`} {...props} />;
}
export function Textarea({
  className = "",
  ...props
}: ComponentProps<"textarea">) {
  return (
    <textarea
      className={`${controlClasses} resize-y ${className}`}
      {...props}
    />
  );
}
export function Select({ className = "", ...props }: ComponentProps<"select">) {
  return <select className={`${controlClasses} ${className}`} {...props} />;
}
export function Checkbox({
  className = "",
  ...props
}: Omit<ComponentProps<"input">, "type">) {
  return (
    <input
      type="checkbox"
      className={`h-5 w-5 accent-gray-900 ${className}`}
      {...props}
    />
  );
}
