import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createTranslator,
  eventCount,
  resolveLocale,
  months,
  weekdays,
} from "../.i18n-test/index.js";
import { validationMessage } from "../.i18n-test/validation.js";
import en from "../src/i18n/messages/en.json" with { type: "json" };
import ru from "../src/i18n/messages/ru.json" with { type: "json" };

test("catalogs have identical keys and interpolation parameters", () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(ru).sort());
  for (const key of Object.keys(en)) {
    assert.ok(en[key].trim());
    assert.ok(ru[key].trim());
    const placeholders = (text) =>
      [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
    assert.deepEqual(placeholders(en[key]), placeholders(ru[key]), key);
  }
});

test("translations interpolate user content without interpreting it", () => {
  const name = "<img src=x> {count} $&";
  assert.equal(
    createTranslator("en")("events.editLabel", { name }),
    `Edit event “${name}”`,
  );
  assert.equal(
    createTranslator("ru")("events.editLabel", { name }),
    `Редактировать событие «${name}»`,
  );
});

test("event counts follow English and Russian plural rules", () => {
  for (const count of [0, 2, 5, 11, 21, 22, 25, 101]) {
    assert.equal(eventCount(count, "en"), `${count} events in this period`);
  }
  assert.equal(eventCount(1, "en"), "1 event in this period");
  for (const [count, noun] of [
    [0, "событий"],
    [1, "событие"],
    [2, "события"],
    [5, "событий"],
    [11, "событий"],
    [21, "событие"],
    [22, "события"],
    [25, "событий"],
    [101, "событие"],
  ]) {
    assert.equal(eventCount(count, "ru"), `${count} ${noun} в этом периоде`);
  }
});

test("locale resolution has a stable Russian fallback", () => {
  for (const value of [undefined, "", "fr", "ru"])
    assert.equal(resolveLocale(value), "ru");
  assert.equal(resolveLocale("en"), "en");
});

test("date headings contain twelve months and start the week on Monday", () => {
  assert.equal(months.length, 12);
  assert.equal(weekdays.length, 7);
  const english = process.env.NEXT_PUBLIC_LOCALE === "en";
  assert.equal(months[0], english ? "January" : "январь");
  assert.equal(weekdays[0], english ? "Mon" : "пн");
});

test("validation translates field names, required values, limits and unknown issues", () => {
  assert.equal(
    validationMessage({ code: "too_small", path: ["name"], minimum: 1 }, "en"),
    "Name: this field is required.",
  );
  assert.equal(
    validationMessage({ code: "too_big", path: ["month"], maximum: 12 }, "ru"),
    "Месяц: максимальное значение — 12.",
  );
  assert.equal(
    validationMessage({ code: "too_big", path: ["name"], maximum: 200 }, "en"),
    "Name: use at most 200 characters.",
  );
  assert.equal(
    validationMessage({ code: "invalid_type", path: ["day"] }, "en"),
    "Day: invalid value.",
  );
  assert.equal(
    validationMessage({ code: "custom", path: [] }, "en"),
    "Value: invalid value.",
  );
});
