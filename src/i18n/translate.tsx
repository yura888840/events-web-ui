import { translate, type MessageKey, type TranslationValues } from "./index";

/** Declarative translation for JSX; returns text without an extra DOM element. */
export function Translate({
  token,
  values,
}: {
  token: MessageKey;
  values?: TranslationValues;
}) {
  return translate(token, values);
}
