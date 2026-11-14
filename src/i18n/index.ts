import en from "./messages/en.json";
import ru from "./messages/ru.json";

export type Locale = "ru" | "en";
export type MessageKey = keyof typeof en;
export type TranslationValues = Record<string, string | number>;
const messages: Record<Locale, Record<MessageKey, string>> = { en, ru };

export function resolveLocale(value?: string): Locale {
  return value === "ru" ? "ru" : "en";
}

// A build-time setting shared by server components, client components and metadata.
export const locale = resolveLocale(process.env.NEXT_PUBLIC_LOCALE);
export const intlLocale = locale === "ru" ? "ru-RU" : "en-GB";

export function createTranslator(language: Locale) {
  return (key: MessageKey, parameters: TranslationValues = {}): string =>
    messages[language][key].replace(
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
  return createTranslator(language)(`CALENDAR_COUNT_${suffix}`, { count });
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
