import {
  FIELDS_DAY,
  FIELDS_DESCRIPTION,
  FIELDS_IS_ACTIVE,
  FIELDS_MONTH,
  FIELDS_NAME,
  FIELDS_RECURRENCE,
  FIELDS_TYPE,
  FIELDS_VALUE,
  FIELDS_YEAR,
  VALIDATION_INVALID,
  VALIDATION_MAXIMUM,
  VALIDATION_MINIMUM,
  VALIDATION_NAME_LENGTH,
  VALIDATION_REQUIRED,
} from "./tokens";
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
  name: FIELDS_NAME,
  description: FIELDS_DESCRIPTION,
  day: FIELDS_DAY,
  month: FIELDS_MONTH,
  year: FIELDS_YEAR,
  type: FIELDS_TYPE,
  recurrence: FIELDS_RECURRENCE,
  isActive: FIELDS_IS_ACTIVE,
};

/** Translate schema issues without leaking schema paths or English Zod messages. */
export function validationMessage(
  issue: ValidationIssue,
  language: Locale = locale,
): string {
  const translate = createTranslator(language);
  const fieldName = String(issue.path[0] ?? "");
  const field = translate(fields[fieldName] ?? FIELDS_VALUE);
  if (issue.code === "too_small" && issue.minimum !== undefined) {
    return fieldName === "name"
      ? translate(VALIDATION_REQUIRED, { field })
      : translate(VALIDATION_MINIMUM, {
          field,
          minimum: String(issue.minimum),
        });
  }
  if (issue.code === "too_big" && issue.maximum !== undefined) {
    return translate(
      fieldName === "name" ? VALIDATION_NAME_LENGTH : VALIDATION_MAXIMUM,
      {
        field,
        maximum: String(issue.maximum),
      },
    );
  }
  return translate(VALIDATION_INVALID, { field });
}
