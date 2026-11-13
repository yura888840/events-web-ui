import Link from "next/link";
import type { ComponentProps } from "react";

const variants = {
  primary:
    "inline-flex items-center gap-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-blue-600",
  submit:
    "bg-gray-900 text-white hover:bg-gray-700 focus-visible:outline-gray-900",
  secondary:
    "border border-gray-300 hover:bg-gray-200 focus-visible:outline-gray-600",
  icon: "p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 focus-visible:outline-red-600",
};
type Variant = keyof typeof variants;
function buttonClasses(variant: Variant, className = "") {
  return `cursor-pointer rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variant === "icon" ? "" : "px-4 py-2"} ${variants[variant]} ${className}`;
}
export function Button({
  variant = "primary",
  type = "button",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, className)}
      {...props}
    />
  );
}
export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}
