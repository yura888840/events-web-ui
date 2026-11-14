"use client";

import { t } from "@/i18n";
import { useState, type FormEvent } from "react";
import type { CalendarEvent } from "@/components/events-calendar/EventsCalendar";

type Props = {
  date: Date;
  event?: CalendarEvent;
  onSave: (event: CalendarEvent) => void;
  onCancel: () => void;
};

export function EventEditor({ date, event, onSave, onCancel }: Props) {
  const [name, setName] = useState(event?.name ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [type, setType] = useState<CalendarEvent["type"]>(
    event?.type ?? "other",
  );
  const [category, setCategory] = useState<"personal" | "work">(
    event?.category ?? "personal",
  );
  const [recurrence, setRecurrence] = useState<CalendarEvent["recurrence"]>(
    event?.recurrence ?? "none",
  );
  const [day, setDay] = useState(
    [
      event?.year ?? date.getFullYear(),
      String(event?.month ?? date.getMonth() + 1).padStart(2, "0"),
      String(event?.day ?? date.getDate()).padStart(2, "0"),
    ].join("-"),
  );
  const [time, setTime] = useState(event?.time ?? "");
  const [isActive, setIsActive] = useState(event?.isActive ?? true);
  const [error, setError] = useState("");

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parts = day.split("-").map(Number);
    const [year, month, dateNumber] = parts;
    const check = new Date(year, month - 1, dateNumber);
    if (
      !name.trim() ||
      !day ||
      !year ||
      check.getFullYear() !== year ||
      check.getMonth() + 1 !== month ||
      check.getDate() !== dateNumber
    ) {
      setError(t("editor.invalid"));
      return;
    }
    onSave({
      id: event?.id ?? crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      year,
      month,
      day: dateNumber,
      type,
      category: type === "birthday" ? "personal" : category,
      recurrence,
      isActive,
      time: time || undefined,
    });
  }

  return (
    <form onSubmit={submit} className="calendar-editor">
      <h2>{event ? t("editor.edit") : t("editor.new")}</h2>
      <label>
        {t("fields.name")}{" "}
        <input
          autoFocus
          required
          maxLength={160}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        {t("fields.description")}{" "}
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <div className="editor-fields">
        <label>
          {t("fields.date")}{" "}
          <input
            required
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
        </label>
        <label>
          {t("fields.time")}{" "}
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
      </div>
      <div className="editor-fields">
        <label>
          {t("fields.shortType")}{" "}
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CalendarEvent["type"])}
          >
            <option value="other">{t("types.event")}</option>
            <option value="birthday">{t("types.birthday")}</option>
          </select>
        </label>
        <label>
          {t("calendar.title")}{" "}
          <select
            value={category}
            disabled={type === "birthday"}
            onChange={(e) => setCategory(e.target.value as "personal" | "work")}
          >
            <option value="personal">{t("categories.personal")}</option>
            <option value="work">{t("categories.work")}</option>
          </select>
        </label>
      </div>
      <label>
        {t("fields.recurrence")}{" "}
        <select
          value={recurrence}
          onChange={(e) =>
            setRecurrence(e.target.value as CalendarEvent["recurrence"])
          }
        >
          <option value="none">{t("editor.noRepeat")}</option>
          <option value="yearly">{t("editor.yearly")}</option>
        </select>
      </label>
      <label className="editor-check">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        {t("editor.active")}
      </label>
      {error && (
        <p role="alert" className="editor-error">
          {error}
        </p>
      )}
      <div className="editor-actions">
        <button className="editor-cancel" type="button" onClick={onCancel}>
          {t("common.cancel")}
        </button>
        <button className="editor-submit" type="submit">
          {t("common.save")}
        </button>
      </div>
    </form>
  );
}
