import {
  createTranslator,
  locale,
  type Locale,
  type MessageKey,
} from "./index";

type ValidationIssue = {
  code: string;
  path: readonly PropertyKey[];
  minimum?: number | bigint;
  maximum?: number | bigint;
};

const fields: Record<string, MessageKey> = {
  name: "fields.name",
  description: "fields.description",
  day: "fields.day",
  month: "fields.month",
  year: "fields.year",
  type: "fields.type",
  recurrence: "fields.recurrence",
  isActive: "fields.isActive",
};

/** Translate schema issues without leaking schema paths or English Zod messages. */
export function validationMessage(
  issue: ValidationIssue,
  language: Locale = locale,
): string {
  const t = createTranslator(language);
  const fieldName = String(issue.path[0] ?? "");
  const field = t(fields[fieldName] ?? "fields.value");
  if (issue.code === "too_small" && issue.minimum !== undefined) {
    return fieldName === "name"
      ? t("validation.required", { field })
      : t("validation.minimum", { field, minimum: String(issue.minimum) });
  }
  if (issue.code === "too_big" && issue.maximum !== undefined) {
    return t(
      fieldName === "name" ? "validation.nameLength" : "validation.maximum",
      {
        field,
        maximum: String(issue.maximum),
      },
    );
  }
  return t("validation.invalid", { field });
}
