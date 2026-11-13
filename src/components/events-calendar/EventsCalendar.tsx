'use client';
import './EventsCalendar.css';
import { useState } from 'react';
import { EventEditor } from '@/modules/events/calendar/EventEditor';
import { CalendarDays, ChevronLeft, ChevronRight, Search, SlidersHorizontal, X, Cake, Calendar, ArrowUpRight, LayoutGrid, Plus, List, Pencil, Trash2 } from 'lucide-react';
export type CalendarEvent = {
    id: string;
    name: string;
    description: string;
    year?: number;
    month: number;
    day: number;
    type: 'birthday' | 'other';
    recurrence: 'yearly' | 'none';
    isActive: boolean;
    time?: string;
    category?: 'work' | 'personal';
};
const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const weekdays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
const add = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const monday = (d: Date) => add(d, -((d.getDay() + 6) % 7));
const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const dateLabel = (d: Date) => d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
const kind = (e: CalendarEvent) => e.type === 'birthday' ? 'birthday' : e.category || 'personal';
const labels = { work: 'Работа', personal: 'Личное', birthday: 'Дни рождения' };
export function EventsCalendar({ events, initialDate = new Date(), onCreate, onUpdate, onDelete, storageReady = true }: {
    events: CalendarEvent[];
    initialDate?: Date;
    onCreate?: (event: CalendarEvent) => void;
    onUpdate?: (event: CalendarEvent) => void;
    onDelete?: (id: string) => void;
    storageReady?: boolean;
}) {
    const [cursor, setCursor] = useState(initialDate);
    const [view, setView] = useState<'month' | 'week' | 'list'>('month');
    const [query, setQuery] = useState('');
    const [showInactive, setShowInactive] = useState(false);
    const [filters, setFilters] = useState(['work', 'personal', 'birthday']);
    const [selected, setSelected] = useState<{
        event: CalendarEvent;
        date: Date;
    } | null>(null);
    const [today] = useState(() => new Date());
    const [editor, setEditor] = useState<{ date: Date; event?: CalendarEvent } | null>(null);
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const start = view === 'list' ? first : monday(view === 'month' ? first : cursor);
    const count = view === 'week' ? 7 : view === 'list' ? daysInMonth : Math.ceil((((first.getDay() + 6) % 7) + daysInMonth) / 7) * 7;
    const days = Array.from({ length: count }, (_, i) => add(start, i));
    const matches = (e: CalendarEvent, d: Date) => (e.isActive || showInactive) && e.month === d.getMonth() + 1 && e.day === d.getDate() && (e.recurrence === 'yearly' || e.year === d.getFullYear());
    const visible = events.filter(e => filters.includes(kind(e)) && e.name.toLowerCase().includes(query.toLowerCase()));
    const onDay = (d: Date) => visible.filter(e => matches(e, d)).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    const move = (n: number) => setCursor(view === 'week' ? add(cursor, n * 7) : new Date(cursor.getFullYear(), cursor.getMonth() + n, 1));
    const jump = (year: number, month: number) => setCursor(new Date(year, month, 1));
    const miniStart = monday(first);
    const miniDays = Array.from({ length: 42 }, (_, i) => add(miniStart, i));
    const total = days.reduce((n, d) => n + onDay(d).length, 0);
    const listedDays = days.filter(d => onDay(d).length > 0);
    function saveEvent(event: CalendarEvent) {
        if (!editor) return;
        if (editor.event) onUpdate?.(event);
        else onCreate?.(event);
        if (!event.isActive) setShowInactive(true);
        // Keep the viewed occurrence year when editing a recurring event.
        const year = event.recurrence === 'yearly' && editor.event
            ? editor.date.getFullYear()
            : event.year ?? editor.date.getFullYear();
        // Selecting the month avoids rolling February 29 into March in a non-leap year.
        const lastDay = new Date(year, event.month, 0).getDate();
        setCursor(new Date(year, event.month - 1, Math.min(event.day, lastDay)));
        setEditor(null);
    }
    return <div className="events-calendar-root shell">
 <header className="topbar"><div className="brand"><span className="brand-icon"><CalendarDays size={21}/></span>events<span className="brand-dot">.</span></div><span className="top-title">Ваше время. Ваши события.</span><div className="profile"><span className="status-dot"/>Личное пространство<span className="avatar">ЮО</span></div></header>
 <div className="workspace"><aside><div className="side-title">ПРОСТРАНСТВО</div><div className="nav-active"><CalendarDays size={18}/>Календарь<span>01</span></div>
 <div className="mini"><div className="mini-title">{months[cursor.getMonth()]} {cursor.getFullYear()}<div><button type="button" aria-label="Предыдущий месяц" onClick={() => jump(cursor.getFullYear(), cursor.getMonth() - 1)}><ChevronLeft size={16}/></button><button type="button" aria-label="Следующий месяц" onClick={() => jump(cursor.getFullYear(), cursor.getMonth() + 1)}><ChevronRight size={16}/></button></div></div><div className="mini-grid">{weekdays.map(x => <span className="mini-weekday" key={x}>{x[0] + x[1].toLowerCase()}</span>)}{miniDays.map(d => <button type="button" key={d.toISOString()} className={`${d.getMonth() !== cursor.getMonth() ? 'muted' : ''} ${same(d, cursor) ? 'chosen' : ''} ${same(d, today) ? 'mini-today' : ''}`} onClick={() => setCursor(d)}>{d.getDate()}{events.some(e => matches(e, d)) && <i />}</button>)}</div></div>
 <div className="side-section"><div className="side-title">МОИ КАЛЕНДАРИ <SlidersHorizontal size={14}/></div>{Object.entries(labels).map(([key, label]) => <label className="filter" key={key}><input type="checkbox" checked={filters.includes(key)} onChange={() => setFilters(filters.includes(key) ? filters.filter(k => k !== key) : [...filters, key])} style={{ accentColor: key === 'work' ? '#4269d1' : key === 'birthday' ? '#b079c2' : '#4d9987' }}/>{label}<span className={'dot ' + key}/></label>)}</div>
 <div className="sidebar-note"><span className="note-icon">✧</span><strong>Важное — рядом</strong><p>Встречи, дни рождения и ваши планы в одном календаре.</p></div><div className="sidebar-bottom"><span className="status-dot"/>Демо · локальные события</div></aside>
 <main><div className="page-heading"><div><div className="eyebrow">ПЛАНЫ И ВАЖНЫЕ ДАТЫ</div><h1>Календарь</h1></div><div className="calendar-heading-actions"><button type="button" className="calendar-add-button" onClick={() => setEditor({ date: cursor })}><Plus size={16}/> Добавить событие</button><label className="search"><Search size={17}/><input placeholder="Найти событие" aria-label="Найти событие" value={query} onChange={e => setQuery(e.target.value)}/>{query && <button type="button" aria-label="Очистить поиск" onClick={() => setQuery('')}><X size={14}/></button>}</label></div></div>
 <div className="toolbar"><div className="period"><button type="button" className="today-button" onClick={() => setCursor(today)}>Сегодня</button><div className="arrows"><button type="button" aria-label="Предыдущий период" onClick={() => move(-1)}><ChevronLeft size={19}/></button><button type="button" aria-label="Следующий период" onClick={() => move(1)}><ChevronRight size={19}/></button></div><h2>{view !== 'week' ? `${months[cursor.getMonth()]} ${cursor.getFullYear()}` : `${dateLabel(start)} — ${dateLabel(add(start, 6))} ${cursor.getFullYear()}`}</h2></div><div className="view-switch"><button type="button" aria-pressed={view === 'list'} className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}><List size={14}/>Список</button><button type="button" aria-pressed={view === 'week'} className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>Неделя</button><button type="button" aria-pressed={view === 'month'} className={view === 'month' ? 'active' : ''} onClick={() => setView('month')}><LayoutGrid size={14}/>Месяц</button></div></div>
 <label className="filter"><input type="checkbox" checked={showInactive} onChange={e => setShowInactive(e.target.checked)} />Показать неактивные</label>
 <div className="sub-toolbar"><span><span className="small-dot"/>{total} событий в этом периоде</span><div className="jump"><Calendar size={14}/><select aria-label="Выбрать месяц" value={cursor.getMonth()} onChange={e => jump(cursor.getFullYear(), Number(e.target.value))}>{months.map((m, i) => <option key={m} value={i}>{m}</option>)}</select><input aria-label="Выбрать год" type="number" min="1" max="9999" value={cursor.getFullYear()} onChange={e => { const n = Number(e.target.value); if (n >= 1 && n <= 9999)
        jump(n, cursor.getMonth()); }}/></div></div>
 {view === "list" ? <div className="calendar-list">{listedDays.length === 0 ? <p className="calendar-empty">В этом периоде событий нет</p> : listedDays.map(d => <section key={d.toISOString()} className="calendar-list-day"><h3>{d.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}</h3>{onDay(d).map(e => <button type="button" key={e.id} className={`calendar-list-event ${kind(e)}`} onClick={() => setSelected({ event: e, date: d })}><strong>{e.time || "Весь день"}</strong><span>{e.name}{!e.isActive && ' · Неактивно'}</span><ArrowUpRight size={14}/></button>)}</section>)}</div> : <div className="calendar-scroll"><section className={`calendar ${view}`} aria-label="Календарь событий"><div className="weekdays">{weekdays.map((w, i) => <div className={i > 4 ? 'weekend' : ''} key={w}>{w}{view === 'week' && <span className={same(days[i], today) ? 'today-number' : ''}>{days[i].getDate()}</span>}</div>)}</div><div className="calendar-grid" style={{ gridTemplateRows: `repeat(${count / 7},minmax(${view === 'week' ? 420 : 118}px,1fr))` }}>{days.map((d, i) => <div key={d.toISOString()} className={`day ${d.getMonth() !== cursor.getMonth() && view === 'month' ? 'outside' : ''} ${i % 7 > 4 ? 'weekend' : ''} ${same(d, today) ? 'is-today' : ''}`}><div className="day-heading"><button type="button" className="calendar-day-create" aria-label={`Добавить событие: ${dateLabel(d)}`} onClick={() => setEditor({ date: d })}><Plus size={12}/></button><span className={same(d, today) ? 'today-number' : ''}>{d.getDate()}</span>{same(d, today) && <small>СЕГОДНЯ</small>}</div><div className="day-events">{onDay(d).map(e => <button type="button" key={e.id} className={`event ${kind(e)}`} onClick={() => setSelected({ event: e, date: d })}>{e.type === 'birthday' && <Cake size={13}/>}<span>{e.time && <b>{e.time} </b>}{e.name}{!e.isActive && ' · Неактивно'}</span>{view === 'week' && <small>{e.time ? 'Запланированное событие' : 'Весь день'}</small>}</button>)}</div></div>)}</div></section></div>}
 <footer><span>Неделя начинается в понедельник</span><span>Нажмите на событие, чтобы посмотреть подробности <ArrowUpRight size={13}/></span></footer>
 </main></div>{!storageReady && <span className="calendar-loading" role="status">Загрузка событий…</span>}{editor && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setEditor(null); }}><section className="event-modal" role="dialog" aria-modal="true" aria-label={editor.event ? "Редактирование события" : "Создание события"}><button type="button" className="close" aria-label="Закрыть" onClick={() => setEditor(null)}><X size={20}/></button><EventEditor key={editor.event?.id ?? editor.date.toISOString()} date={editor.date} event={editor.event} onCancel={() => setEditor(null)} onSave={saveEvent}/></section></div>}{selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><section className="event-modal" role="dialog" aria-modal="true" aria-label="Подробности события" onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key === 'Escape')
        setSelected(null); }}><button type="button" autoFocus className="close" aria-label="Закрыть" onClick={() => setSelected(null)}><X size={20}/></button><span className={`detail-tag ${kind(selected.event)}`}>{labels[kind(selected.event)]}</span><h2>{selected.event.name}</h2>{!selected.event.isActive && <p>Неактивное событие</p>}<p className="detail-date"><CalendarDays size={18}/>{dateLabel(selected.date)} {selected.date.getFullYear()} · {selected.event.time || 'Весь день'}</p><p>{selected.event.description}</p>{selected.event.recurrence === 'yearly' && <p className="recurrence">Повторяется каждый год</p>}<div className="calendar-detail-actions">{onDelete && <button type="button" className="calendar-delete-button" onClick={() => { if (window.confirm("Удалить событие?")) { onDelete(selected.event.id); setSelected(null); } }}><Trash2 size={15}/> Удалить</button>}{onUpdate && <button type="button" className="calendar-edit-button" onClick={() => { setEditor({ event: selected.event, date: selected.date }); setSelected(null); }}><Pencil size={15}/> Редактировать</button>}<button type="button" className="done" onClick={() => setSelected(null)}>Закрыть</button></div></section></div>}
 </div>;
}
