"use client";
import {
  APP_AVATAR,
  APP_BRAND,
  CALENDAR_ADD,
  CALENDAR_ADD_ON_DATE,
  CALENDAR_ALL_DAY,
  CALENDAR_CHOOSE_MONTH,
  CALENDAR_CHOOSE_YEAR,
  CALENDAR_CLEAR_SEARCH,
  CALENDAR_CONFIRM_DELETE,
  CALENDAR_CREATE_DIALOG,
  CALENDAR_DEMO,
  CALENDAR_DETAILS,
  CALENDAR_DETAILS_HINT,
  CALENDAR_EDIT_DIALOG,
  CALENDAR_EMPTY,
  CALENDAR_EYEBROW,
  CALENDAR_INACTIVE,
  CALENDAR_INACTIVE_SUFFIX,
  CALENDAR_LABEL,
  CALENDAR_LIST,
  CALENDAR_LOADING,
  CALENDAR_MY_CALENDARS,
  CALENDAR_NEXT_MONTH,
  CALENDAR_NEXT_PERIOD,
  CALENDAR_NOTE,
  CALENDAR_NOTE_TITLE,
  CALENDAR_PREVIOUS_MONTH,
  CALENDAR_PREVIOUS_PERIOD,
  CALENDAR_RECURRING,
  CALENDAR_SCHEDULED,
  CALENDAR_SEARCH,
  CALENDAR_SHOW_INACTIVE,
  CALENDAR_SPACE,
  CALENDAR_TAGLINE,
  CALENDAR_TITLE,
  CALENDAR_TODAY,
  CALENDAR_TODAY_BADGE,
  CALENDAR_WEEK,
  CALENDAR_WEEK_START,
  CALENDAR_WORKSPACE,
  CATEGORIES_BIRTHDAY,
  CATEGORIES_PERSONAL,
  CATEGORIES_WORK,
  COMMON_CLOSE,
  COMMON_DELETE,
  COMMON_EDIT,
  FIELDS_MONTH,
} from "@/i18n/tokens";
import { Translate } from "@/i18n/translate";
import { translate, eventCount, formatDate, months, weekdays } from "@/i18n";
import "./EventsCalendar.css";
import { useState } from "react";
import { EventEditor } from "@/modules/events/calendar/EventEditor";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
  Cake,
  Calendar,
  ArrowUpRight,
  LayoutGrid,
  Plus,
  List,
  Pencil,
  Trash2,
} from "lucide-react";
export type CalendarEvent = {
  id: string;
  name: string;
  description: string;
  year?: number;
  month: number;
  day: number;
  type: "birthday" | "other";
  recurrence: "yearly" | "none";
  isActive: boolean;
  time?: string;
  category?: "work" | "personal";
};
const add = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const monday = (d: Date) => add(d, -((d.getDay() + 6) % 7));
const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const dateLabel = (d: Date) => formatDate(d, { day: "numeric", month: "long" });
const kind = (e: CalendarEvent) =>
  e.type === "birthday" ? "birthday" : e.category || "personal";
const labels = {
  work: translate(CATEGORIES_WORK),
  personal: translate(CATEGORIES_PERSONAL),
  birthday: translate(CATEGORIES_BIRTHDAY),
};
export function EventsCalendar({
  events,
  initialDate = new Date(),
  onCreate,
  onUpdate,
  onDelete,
  storageReady = true,
}: {
  events: CalendarEvent[];
  initialDate?: Date;
  onCreate?: (event: CalendarEvent) => void;
  onUpdate?: (event: CalendarEvent) => void;
  onDelete?: (id: string) => void;
  storageReady?: boolean;
}) {
  const [cursor, setCursor] = useState(initialDate);
  const [view, setView] = useState<"month" | "week" | "list">("month");
  const [query, setQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [filters, setFilters] = useState(["work", "personal", "birthday"]);
  const [selected, setSelected] = useState<{
    event: CalendarEvent;
    date: Date;
  } | null>(null);
  const [today] = useState(() => new Date());
  const [editor, setEditor] = useState<{
    date: Date;
    event?: CalendarEvent;
  } | null>(null);
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const daysInMonth = new Date(
    cursor.getFullYear(),
    cursor.getMonth() + 1,
    0,
  ).getDate();
  const start =
    view === "list" ? first : monday(view === "month" ? first : cursor);
  const count =
    view === "week"
      ? 7
      : view === "list"
        ? daysInMonth
        : Math.ceil((((first.getDay() + 6) % 7) + daysInMonth) / 7) * 7;
  const days = Array.from({ length: count }, (_, i) => add(start, i));
  const matches = (e: CalendarEvent, d: Date) =>
    (e.isActive || showInactive) &&
    e.month === d.getMonth() + 1 &&
    e.day === d.getDate() &&
    (e.recurrence === "yearly" || e.year === d.getFullYear());
  const visible = events.filter(
    (e) =>
      filters.includes(kind(e)) &&
      e.name.toLowerCase().includes(query.toLowerCase()),
  );
  const onDay = (d: Date) =>
    visible
      .filter((e) => matches(e, d))
      .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  const move = (n: number) =>
    setCursor(
      view === "week"
        ? add(cursor, n * 7)
        : new Date(cursor.getFullYear(), cursor.getMonth() + n, 1),
    );
  const jump = (year: number, month: number) =>
    setCursor(new Date(year, month, 1));
  const miniStart = monday(first);
  const miniDays = Array.from({ length: 42 }, (_, i) => add(miniStart, i));
  const total = days.reduce((n, d) => n + onDay(d).length, 0);
  const listedDays = days.filter((d) => onDay(d).length > 0);
  function saveEvent(event: CalendarEvent) {
    if (!editor) return;
    if (editor.event) onUpdate?.(event);
    else onCreate?.(event);
    if (!event.isActive) setShowInactive(true);
    // Keep the viewed occurrence year when editing a recurring event.
    const year =
      event.recurrence === "yearly" && editor.event
        ? editor.date.getFullYear()
        : (event.year ?? editor.date.getFullYear());
    // Selecting the month avoids rolling February 29 into March in a non-leap year.
    const lastDay = new Date(year, event.month, 0).getDate();
    setCursor(new Date(year, event.month - 1, Math.min(event.day, lastDay)));
    setEditor(null);
  }
  return (
    <div className="events-calendar-root shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">
            <CalendarDays size={21} />
          </span>
          <Translate token={APP_BRAND} />
          <span className="brand-dot">.</span>
        </div>
        <span className="top-title">
          <Translate token={CALENDAR_TAGLINE} />
        </span>
        <div className="profile">
          <span className="status-dot" />
          <Translate token={CALENDAR_SPACE} />
          <span className="avatar">
            <Translate token={APP_AVATAR} />
          </span>
        </div>
      </header>
      <div className="workspace">
        <aside>
          <div className="side-title">
            <Translate token={CALENDAR_WORKSPACE} />
          </div>
          <div className="nav-active">
            <CalendarDays size={18} />
            <Translate token={CALENDAR_TITLE} />
            <span>01</span>
          </div>
          <div className="mini">
            <div className="mini-title">
              {months[cursor.getMonth()]} {cursor.getFullYear()}
              <div>
                <button
                  type="button"
                  aria-label={translate(CALENDAR_PREVIOUS_MONTH)}
                  onClick={() =>
                    jump(cursor.getFullYear(), cursor.getMonth() - 1)
                  }
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  aria-label={translate(CALENDAR_NEXT_MONTH)}
                  onClick={() =>
                    jump(cursor.getFullYear(), cursor.getMonth() + 1)
                  }
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="mini-grid">
              {weekdays.map((x) => (
                <span className="mini-weekday" key={x}>
                  {x}
                </span>
              ))}
              {miniDays.map((d) => (
                <button
                  type="button"
                  key={d.toISOString()}
                  className={`${d.getMonth() !== cursor.getMonth() ? "muted" : ""} ${same(d, cursor) ? "chosen" : ""} ${same(d, today) ? "mini-today" : ""}`}
                  onClick={() => setCursor(d)}
                >
                  {d.getDate()}
                  {events.some((e) => matches(e, d)) && <i />}
                </button>
              ))}
            </div>
          </div>
          <div className="side-section">
            <div className="side-title">
              <Translate token={CALENDAR_MY_CALENDARS} />{" "}
              <SlidersHorizontal size={14} />
            </div>
            {Object.entries(labels).map(([key, label]) => (
              <label className="filter" key={key}>
                <input
                  type="checkbox"
                  checked={filters.includes(key)}
                  onChange={() =>
                    setFilters(
                      filters.includes(key)
                        ? filters.filter((k) => k !== key)
                        : [...filters, key],
                    )
                  }
                  style={{
                    accentColor:
                      key === "work"
                        ? "#4269d1"
                        : key === "birthday"
                          ? "#b079c2"
                          : "#4d9987",
                  }}
                />
                {label}
                <span className={"dot " + key} />
              </label>
            ))}
          </div>
          <div className="sidebar-note">
            <span className="note-icon">✧</span>
            <strong>
              <Translate token={CALENDAR_NOTE_TITLE} />
            </strong>
            <p>
              <Translate token={CALENDAR_NOTE} />
            </p>
          </div>
          <div className="sidebar-bottom">
            <span className="status-dot" />
            <Translate token={CALENDAR_DEMO} />
          </div>
        </aside>
        <main>
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <Translate token={CALENDAR_EYEBROW} />
              </div>
              <h1>
                <Translate token={CALENDAR_TITLE} />
              </h1>
            </div>
            <div className="calendar-heading-actions">
              <button
                type="button"
                className="calendar-add-button"
                onClick={() => setEditor({ date: cursor })}
              >
                <Plus size={16} /> <Translate token={CALENDAR_ADD} />
              </button>
              <label className="search">
                <Search size={17} />
                <input
                  placeholder={translate(CALENDAR_SEARCH)}
                  aria-label={translate(CALENDAR_SEARCH)}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    type="button"
                    aria-label={translate(CALENDAR_CLEAR_SEARCH)}
                    onClick={() => setQuery("")}
                  >
                    <X size={14} />
                  </button>
                )}
              </label>
            </div>
          </div>
          <div className="toolbar">
            <div className="period">
              <button
                type="button"
                className="today-button"
                onClick={() => setCursor(today)}
              >
                <Translate token={CALENDAR_TODAY} />
              </button>
              <div className="arrows">
                <button
                  type="button"
                  aria-label={translate(CALENDAR_PREVIOUS_PERIOD)}
                  onClick={() => move(-1)}
                >
                  <ChevronLeft size={19} />
                </button>
                <button
                  type="button"
                  aria-label={translate(CALENDAR_NEXT_PERIOD)}
                  onClick={() => move(1)}
                >
                  <ChevronRight size={19} />
                </button>
              </div>
              <h2>
                {view !== "week"
                  ? `${months[cursor.getMonth()]} ${cursor.getFullYear()}`
                  : `${dateLabel(start)} — ${dateLabel(add(start, 6))} ${cursor.getFullYear()}`}
              </h2>
            </div>
            <div className="view-switch">
              <button
                type="button"
                aria-pressed={view === "list"}
                className={view === "list" ? "active" : ""}
                onClick={() => setView("list")}
              >
                <List size={14} />
                <Translate token={CALENDAR_LIST} />
              </button>
              <button
                type="button"
                aria-pressed={view === "week"}
                className={view === "week" ? "active" : ""}
                onClick={() => setView("week")}
              >
                <Translate token={CALENDAR_WEEK} />
              </button>
              <button
                type="button"
                aria-pressed={view === "month"}
                className={view === "month" ? "active" : ""}
                onClick={() => setView("month")}
              >
                <LayoutGrid size={14} />
                <Translate token={FIELDS_MONTH} />
              </button>
            </div>
          </div>
          <label className="filter">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
            />
            <Translate token={CALENDAR_SHOW_INACTIVE} />
          </label>
          <div className="sub-toolbar">
            <span>
              <span className="small-dot" />
              {eventCount(total)}
            </span>
            <div className="jump">
              <Calendar size={14} />
              <select
                aria-label={translate(CALENDAR_CHOOSE_MONTH)}
                value={cursor.getMonth()}
                onChange={(e) =>
                  jump(cursor.getFullYear(), Number(e.target.value))
                }
              >
                {months.map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>
              <input
                aria-label={translate(CALENDAR_CHOOSE_YEAR)}
                type="number"
                min="1"
                max="9999"
                value={cursor.getFullYear()}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (n >= 1 && n <= 9999) jump(n, cursor.getMonth());
                }}
              />
            </div>
          </div>
          {view === "list" ? (
            <div className="calendar-list">
              {listedDays.length === 0 ? (
                <p className="calendar-empty">
                  <Translate token={CALENDAR_EMPTY} />
                </p>
              ) : (
                listedDays.map((d) => (
                  <section key={d.toISOString()} className="calendar-list-day">
                    <h3>
                      {formatDate(d, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </h3>
                    {onDay(d).map((e) => (
                      <button
                        type="button"
                        key={e.id}
                        className={`calendar-list-event ${kind(e)}`}
                        onClick={() => setSelected({ event: e, date: d })}
                      >
                        <strong>
                          {e.time || <Translate token={CALENDAR_ALL_DAY} />}
                        </strong>
                        <span>
                          {e.name}
                          {!e.isActive && (
                            <Translate token={CALENDAR_INACTIVE_SUFFIX} />
                          )}
                        </span>
                        <ArrowUpRight size={14} />
                      </button>
                    ))}
                  </section>
                ))
              )}
            </div>
          ) : (
            <div className="calendar-scroll">
              <section
                className={`calendar ${view}`}
                aria-label={translate(CALENDAR_LABEL)}
              >
                <div className="weekdays">
                  {weekdays.map((w, i) => (
                    <div className={i > 4 ? "weekend" : ""} key={w}>
                      {w}
                      {view === "week" && (
                        <span
                          className={same(days[i], today) ? "today-number" : ""}
                        >
                          {days[i].getDate()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div
                  className="calendar-grid"
                  style={{
                    gridTemplateRows: `repeat(${count / 7},minmax(${view === "week" ? 420 : 118}px,1fr))`,
                  }}
                >
                  {days.map((d, i) => (
                    <div
                      key={d.toISOString()}
                      className={`day ${d.getMonth() !== cursor.getMonth() && view === "month" ? "outside" : ""} ${i % 7 > 4 ? "weekend" : ""} ${same(d, today) ? "is-today" : ""}`}
                    >
                      <div className="day-heading">
                        <button
                          type="button"
                          className="calendar-day-create"
                          aria-label={translate(CALENDAR_ADD_ON_DATE, {
                            date: dateLabel(d),
                          })}
                          onClick={() => setEditor({ date: d })}
                        >
                          <Plus size={12} />
                        </button>
                        <span className={same(d, today) ? "today-number" : ""}>
                          {d.getDate()}
                        </span>
                        {same(d, today) && (
                          <small>
                            <Translate token={CALENDAR_TODAY_BADGE} />
                          </small>
                        )}
                      </div>
                      <div className="day-events">
                        {onDay(d).map((e) => (
                          <button
                            type="button"
                            key={e.id}
                            className={`event ${kind(e)}`}
                            onClick={() => setSelected({ event: e, date: d })}
                          >
                            {e.type === "birthday" && <Cake size={13} />}
                            <span>
                              {e.time && <b>{e.time} </b>}
                              {e.name}
                              {!e.isActive && (
                                <Translate token={CALENDAR_INACTIVE_SUFFIX} />
                              )}
                            </span>
                            {view === "week" && (
                              <small>
                                {e.time ? (
                                  <Translate token={CALENDAR_SCHEDULED} />
                                ) : (
                                  <Translate token={CALENDAR_ALL_DAY} />
                                )}
                              </small>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
          <footer>
            <span>
              <Translate token={CALENDAR_WEEK_START} />
            </span>
            <span>
              <Translate token={CALENDAR_DETAILS_HINT} />{" "}
              <ArrowUpRight size={13} />
            </span>
          </footer>
        </main>
      </div>
      {!storageReady && (
        <span className="calendar-loading" role="status">
          <Translate token={CALENDAR_LOADING} />
        </span>
      )}
      {editor && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setEditor(null);
          }}
        >
          <section
            className="event-modal"
            role="dialog"
            aria-modal="true"
            aria-label={
              editor.event
                ? translate(CALENDAR_EDIT_DIALOG)
                : translate(CALENDAR_CREATE_DIALOG)
            }
          >
            <button
              type="button"
              className="close"
              aria-label={translate(COMMON_CLOSE)}
              onClick={() => setEditor(null)}
            >
              <X size={20} />
            </button>
            <EventEditor
              key={editor.event?.id ?? editor.date.toISOString()}
              date={editor.date}
              event={editor.event}
              onCancel={() => setEditor(null)}
              onSave={saveEvent}
            />
          </section>
        </div>
      )}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <section
            className="event-modal"
            role="dialog"
            aria-modal="true"
            aria-label={translate(CALENDAR_DETAILS)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSelected(null);
            }}
          >
            <button
              type="button"
              autoFocus
              className="close"
              aria-label={translate(COMMON_CLOSE)}
              onClick={() => setSelected(null)}
            >
              <X size={20} />
            </button>
            <span className={`detail-tag ${kind(selected.event)}`}>
              {labels[kind(selected.event)]}
            </span>
            <h2>{selected.event.name}</h2>
            {!selected.event.isActive && (
              <p>
                <Translate token={CALENDAR_INACTIVE} />
              </p>
            )}
            <p className="detail-date">
              <CalendarDays size={18} />
              {dateLabel(selected.date)} {selected.date.getFullYear()} ·{" "}
              {selected.event.time || <Translate token={CALENDAR_ALL_DAY} />}
            </p>
            <p>{selected.event.description}</p>
            {selected.event.recurrence === "yearly" && (
              <p className="recurrence">
                <Translate token={CALENDAR_RECURRING} />
              </p>
            )}
            <div className="calendar-detail-actions">
              {onDelete && (
                <button
                  type="button"
                  className="calendar-delete-button"
                  onClick={() => {
                    if (window.confirm(translate(CALENDAR_CONFIRM_DELETE))) {
                      onDelete(selected.event.id);
                      setSelected(null);
                    }
                  }}
                >
                  <Trash2 size={15} /> <Translate token={COMMON_DELETE} />
                </button>
              )}
              {onUpdate && (
                <button
                  type="button"
                  className="calendar-edit-button"
                  onClick={() => {
                    setEditor({ event: selected.event, date: selected.date });
                    setSelected(null);
                  }}
                >
                  <Pencil size={15} /> <Translate token={COMMON_EDIT} />
                </button>
              )}
              <button
                type="button"
                className="done"
                onClick={() => setSelected(null)}
              >
                <Translate token={COMMON_CLOSE} />
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
