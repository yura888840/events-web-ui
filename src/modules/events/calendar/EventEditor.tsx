"use client";

import {
  CALENDAR,
  CATEGORIES,
  COMMON,
  EDITOR,
  FIELDS,
  TYPES,
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
      setError(translate(EDITOR.INVALID));
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
          <Translate token={EDITOR.EDIT} />
        ) : (
          <Translate token={EDITOR.NEW} />
        )}
      </h2>
      <label>
        <Translate token={FIELDS.NAME} />{" "}
        <input
          autoFocus
          required
          maxLength={160}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        <Translate token={FIELDS.DESCRIPTION} />{" "}
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <div className="editor-fields">
        <label>
          <Translate token={FIELDS.DATE} />{" "}
          <input
            required
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
        </label>
        <label>
          <Translate token={FIELDS.TIME} />{" "}
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
      </div>
      <div className="editor-fields">
        <label>
          <Translate token={FIELDS.SHORT.TYPE} />{" "}
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CalendarEvent["type"])}
          >
            <option value="other">
              <Translate token={TYPES.EVENT} />
            </option>
            <option value="birthday">
              <Translate token={TYPES.BIRTHDAY} />
            </option>
          </select>
        </label>
        <label>
          <Translate token={CALENDAR.TITLE} />{" "}
          <select
            value={category}
            disabled={type === "birthday"}
            onChange={(e) => setCategory(e.target.value as "personal" | "work")}
          >
            <option value="personal">
              <Translate token={CATEGORIES.PERSONAL} />
            </option>
            <option value="work">
              <Translate token={CATEGORIES.WORK} />
            </option>
          </select>
        </label>
      </div>
      <label>
        <Translate token={FIELDS.RECURRENCE} />{" "}
        <select
          value={recurrence}
          onChange={(e) =>
            setRecurrence(e.target.value as CalendarEvent["recurrence"])
          }
        >
          <option value="none">
            <Translate token={EDITOR.NO.REPEAT} />
          </option>
          <option value="yearly">
            <Translate token={EDITOR.YEARLY} />
          </option>
        </select>
      </label>
      <label className="editor-check">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        <Translate token={EDITOR.ACTIVE} />
      </label>
      {error && (
        <p role="alert" className="editor-error">
          {error}
        </p>
      )}
      <div className="editor-actions">
        <button className="editor-cancel" type="button" onClick={onCancel}>
          <Translate token={COMMON.CANCEL} />
        </button>
        <button className="editor-submit" type="submit">
          <Translate token={COMMON.SAVE} />
        </button>
      </div>
    </form>
  );
}
