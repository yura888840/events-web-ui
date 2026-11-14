import en from "./messages/en.json";
import ru from "./messages/ru.json";
import { CALENDAR } from "./tokens";

export type Locale = "ru" | "en";
type MessagePaths<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : `${K}.${MessagePaths<T[K]>}`;
}[keyof T & string];
export type MessageKey = MessagePaths<typeof en>;
export type TranslationValues = Record<string, string | number>;
const messages: Record<Locale, typeof en> = { en, ru };
type MessageTree = { [key: string]: string | MessageTree };

function getMessage(language: Locale, key: MessageKey): string {
  let value: string | MessageTree = messages[language];
  for (const segment of key.split(".")) {
    if (typeof value === "string" || !Object.hasOwn(value, segment)) {
      throw new Error(`Unknown translation token: ${key}`);
    }
    value = value[segment];
  }
  if (typeof value !== "string")
    throw new Error(`Incomplete translation token: ${key}`);
  return value;
}

export function resolveLocale(value?: string): Locale {
  return value === "ru" ? "ru" : "en";
}

// A build-time setting shared by server components, client components and metadata.
export const locale = resolveLocale(process.env.NEXT_PUBLIC_LOCALE);
export const intlLocale = locale === "ru" ? "ru-RU" : "en-GB";

export function createTranslator(language: Locale) {
  return (key: MessageKey, parameters: TranslationValues = {}): string =>
    getMessage(language, key).replace(
      /\{(\w+)\}/g,
      (placeholder, name: string) =>
        Object.hasOwn(parameters, name)
          ? String(parameters[name])
          : placeholder,
    );
}

export const translate = createTranslator(locale);

export function eventCount(count: number, language: Locale = locale): string {
  const category = new Intl.PluralRules(language).select(count);
  const suffix =
    category === "one" || category === "few" || category === "many"
      ? (category.toUpperCase() as "ONE" | "FEW" | "MANY")
      : "OTHER";
  return createTranslator(language)(CALENDAR.COUNT[suffix], { count });
}

export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(intlLocale, options).format(date);
}

// Fixed local dates avoid UTC offsets shifting calendar headings to another day.
export const months = Array.from({ length: 12 }, (_, index) =>
  formatDate(new Date(2026, index, 1), { month: "long" }),
);
export const weekdays = Array.from({ length: 7 }, (_, index) =>
  formatDate(new Date(2026, 0, 5 + index), { weekday: "short" }),
);
