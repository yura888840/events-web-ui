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

function flatten(object, prefix = "") {
  return Object.fromEntries(
    Object.entries(object).flatMap(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return typeof value === "string"
        ? [[path, value]]
        : Object.entries(flatten(value, path));
    }),
  );
}
const englishMessages = flatten(en);
const russianMessages = flatten(ru);

test("catalogs have identical keys and interpolation parameters", () => {
  assert.deepEqual(
    Object.keys(englishMessages).sort(),
    Object.keys(russianMessages).sort(),
  );
  for (const key of Object.keys(englishMessages)) {
    assert.ok(englishMessages[key].trim());
    assert.ok(russianMessages[key].trim());
    assert.equal(createTranslator("en")(key), englishMessages[key]);
    assert.equal(createTranslator("ru")(key), russianMessages[key]);
    const placeholders = (text) =>
      [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
    assert.deepEqual(
      placeholders(englishMessages[key]),
      placeholders(russianMessages[key]),
      key,
    );
  }
});

test("translations interpolate user content without interpreting it", () => {
  const name = "<img src=x> {count} $&";
  assert.equal(
    createTranslator("en")("EVENTS.LABEL.EDIT", { name }),
    `Edit event “${name}”`,
  );
  assert.equal(
    createTranslator("ru")("EVENTS.LABEL.EDIT", { name }),
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

test("locale resolution has a stable English fallback", () => {
  for (const value of [undefined, "", "fr", "en"])
    assert.equal(resolveLocale(value), "en");
  assert.equal(resolveLocale("ru"), "ru");
});

test("date headings contain twelve months and start the week on Monday", () => {
  assert.equal(months.length, 12);
  assert.equal(weekdays.length, 7);
  const english = process.env.NEXT_PUBLIC_LOCALE !== "ru";
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

test("language tokens cover the catalogs and Translate renders escaped text without a wrapper", async () => {
  const tokens = await import("../.i18n-test/tokens.js");
  const { Translate } = await import("../.i18n-test/translate.js");
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const namedTokens = Object.keys(tokens).filter(
    (key) =>
      key !== "default" && key !== "__esModule" && key !== "module.exports",
  );
  const tokenPaths = flatten(
    Object.fromEntries(namedTokens.map((key) => [key, tokens[key]])),
  );
  assert.deepEqual(
    Object.keys(tokenPaths).sort(),
    Object.keys(englishMessages).sort(),
  );
  for (const [path, value] of Object.entries(tokenPaths))
    assert.equal(value, path);
  assert.equal(tokens.CALENDAR.DIALOG.CREATE, "CALENDAR.DIALOG.CREATE");
  const english = process.env.NEXT_PUBLIC_LOCALE !== "ru";
  assert.equal(
    renderToStaticMarkup(
      createElement(Translate, { token: tokens.EVENTS.BACK }),
    ),
    english ? "Back to list" : "Назад к списку",
  );
  const html = renderToStaticMarkup(
    createElement(Translate, {
      token: tokens.EVENTS.LABEL.EDIT,
      values: { name: "<script>" },
    }),
  );
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes("<script>"));
});
