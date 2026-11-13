"use client";

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
  const [type, setType] = useState<CalendarEvent["type"]>(event?.type ?? "other");
  const [category, setCategory] = useState<"personal" | "work">(event?.category ?? "personal");
  const [recurrence, setRecurrence] = useState<CalendarEvent["recurrence"]>(event?.recurrence ?? "none");
  const [day, setDay] = useState(
    [event?.year ?? date.getFullYear(), String(event?.month ?? date.getMonth() + 1).padStart(2, "0"), String(event?.day ?? date.getDate()).padStart(2, "0")].join("-")
  );
  const [time, setTime] = useState(event?.time ?? "");
  const [isActive, setIsActive] = useState(event?.isActive ?? true);
  const [error, setError] = useState("");

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parts = day.split("-").map(Number);
    const [year, month, dateNumber] = parts;
    const check = new Date(year, month - 1, dateNumber);
    if (!name.trim() || !day || !year || check.getFullYear() !== year ||
      check.getMonth() + 1 !== month || check.getDate() !== dateNumber) {
      setError("Укажите название и корректную дату.");
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
      <h2>{event ? "Редактировать событие" : "Новое событие"}</h2>
      <label>Название <input autoFocus required maxLength={160} value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label>Описание <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></label>
      <div className="editor-fields">
        <label>Дата <input required type="date" value={day} onChange={(e) => setDay(e.target.value)} /></label>
        <label>Время <input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
      </div>
      <div className="editor-fields">
        <label>Тип <select value={type} onChange={(e) => setType(e.target.value as CalendarEvent["type"])}><option value="other">Событие</option><option value="birthday">День рождения</option></select></label>
        <label>Календарь <select value={category} disabled={type === "birthday"} onChange={(e) => setCategory(e.target.value as "personal" | "work")}><option value="personal">Личное</option><option value="work">Работа</option></select></label>
      </div>
      <label>Повторение <select value={recurrence} onChange={(e) => setRecurrence(e.target.value as CalendarEvent["recurrence"])}><option value="none">Без повтора</option><option value="yearly">Каждый год</option></select></label>
      <label className="editor-check"><input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />Активное событие</label>
      {error && <p role="alert" className="editor-error">{error}</p>}
      <div className="editor-actions"><button className="editor-cancel" type="button" onClick={onCancel}>Отмена</button><button className="editor-submit" type="submit">Сохранить</button></div>
    </form>
  );
}
