import type { ComponentProps } from "react";

type SwitchProps = Omit<
  ComponentProps<"button">,
  "onChange" | "role" | "aria-checked" | "children"
> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  "aria-label": string;
};
export function Switch({
  checked,
  onCheckedChange,
  className = "",
  onClick,
  ...props
}: SwitchProps) {
  return (
    <button
      {...props}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onCheckedChange(!checked);
      }}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-blue-600" : "bg-gray-300"} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}
