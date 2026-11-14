"use client";

import {
  CALENDAR_TITLE,
  CATEGORIES_PERSONAL,
  CATEGORIES_WORK,
  COMMON_CANCEL,
  COMMON_SAVE,
  EDITOR_ACTIVE,
  EDITOR_EDIT,
  EDITOR_INVALID,
  EDITOR_NEW,
  EDITOR_NO_REPEAT,
  EDITOR_YEARLY,
  FIELDS_DATE,
  FIELDS_DESCRIPTION,
  FIELDS_NAME,
  FIELDS_RECURRENCE,
  FIELDS_SHORT_TYPE,
  FIELDS_TIME,
  TYPES_BIRTHDAY,
  TYPES_EVENT,
} from "@/i18n/tokens";
import { Translate } from "@/i18n/translate";
import { translate } from "@/i18n";
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
      setError(translate(EDITOR_INVALID));
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
      <h2>
        {event ? (
          <Translate token={EDITOR_EDIT} />
        ) : (
          <Translate token={EDITOR_NEW} />
        )}
      </h2>
      <label>
        <Translate token={FIELDS_NAME} />{" "}
        <input
          autoFocus
          required
          maxLength={160}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        <Translate token={FIELDS_DESCRIPTION} />{" "}
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <div className="editor-fields">
        <label>
          <Translate token={FIELDS_DATE} />{" "}
          <input
            required
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
        </label>
        <label>
          <Translate token={FIELDS_TIME} />{" "}
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
      </div>
      <div className="editor-fields">
        <label>
          <Translate token={FIELDS_SHORT_TYPE} />{" "}
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CalendarEvent["type"])}
          >
            <option value="other">
              <Translate token={TYPES_EVENT} />
            </option>
            <option value="birthday">
              <Translate token={TYPES_BIRTHDAY} />
            </option>
          </select>
        </label>
        <label>
          <Translate token={CALENDAR_TITLE} />{" "}
          <select
            value={category}
            disabled={type === "birthday"}
            onChange={(e) => setCategory(e.target.value as "personal" | "work")}
          >
            <option value="personal">
              <Translate token={CATEGORIES_PERSONAL} />
            </option>
            <option value="work">
              <Translate token={CATEGORIES_WORK} />
            </option>
          </select>
        </label>
      </div>
      <label>
        <Translate token={FIELDS_RECURRENCE} />{" "}
        <select
          value={recurrence}
          onChange={(e) =>
            setRecurrence(e.target.value as CalendarEvent["recurrence"])
          }
        >
          <option value="none">
            <Translate token={EDITOR_NO_REPEAT} />
          </option>
          <option value="yearly">
            <Translate token={EDITOR_YEARLY} />
          </option>
        </select>
      </label>
      <label className="editor-check">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        <Translate token={EDITOR_ACTIVE} />
      </label>
      {error && (
        <p role="alert" className="editor-error">
          {error}
        </p>
      )}
      <div className="editor-actions">
        <button className="editor-cancel" type="button" onClick={onCancel}>
          <Translate token={COMMON_CANCEL} />
        </button>
        <button className="editor-submit" type="submit">
          <Translate token={COMMON_SAVE} />
        </button>
      </div>
    </form>
  );
}
