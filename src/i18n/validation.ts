import { FIELDS, VALIDATION } from "./tokens";
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
  name: FIELDS.NAME,
  description: FIELDS.DESCRIPTION,
  day: FIELDS.DAY,
  month: FIELDS.MONTH,
  year: FIELDS.YEAR,
  type: FIELDS.TYPE,
  recurrence: FIELDS.RECURRENCE,
  isActive: FIELDS.IS.ACTIVE,
};

/** Translate schema issues without leaking schema paths or English Zod messages. */
export function validationMessage(
  issue: ValidationIssue,
  language: Locale = locale,
): string {
  const translate = createTranslator(language);
  const fieldName = String(issue.path[0] ?? "");
  const field = translate(fields[fieldName] ?? FIELDS.VALUE);
  if (issue.code === "too_small" && issue.minimum !== undefined) {
    return fieldName === "name"
      ? translate(VALIDATION.REQUIRED, { field })
      : translate(VALIDATION.MINIMUM, {
          field,
          minimum: String(issue.minimum),
        });
  }
  if (issue.code === "too_big" && issue.maximum !== undefined) {
    return translate(
      fieldName === "name" ? VALIDATION.NAME.LENGTH : VALIDATION.MAXIMUM,
      {
        field,
        maximum: String(issue.maximum),
      },
    );
  }
  return translate(VALIDATION.INVALID, { field });
}
