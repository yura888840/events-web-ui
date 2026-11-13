"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  createEventDtoSchema,
  type CreateEventDto,
} from "@yura888840/events-contracts";

import type { EventsApiClient } from "../clients/events-api-client.js";
import { MockEventsApiClient } from "../clients/mock/events-api-client.mock";
import { mockEvents } from "../mocks/events";

type EventCreateFormProps = {
  apiClient?: EventsApiClient;
};

const mockApiClient = new MockEventsApiClient(mockEvents);

const inputClassName =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 " +
  "focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600";

export default function EventCreateForm({
  apiClient = mockApiClient,
}: EventCreateFormProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    const form = event.currentTarget;

    setErrors([]);
    setIsSaved(false);

    const formData = new FormData(form);

    const year = String(formData.get("year") ?? "").trim();
    const month = String(formData.get("month") ?? "").trim();
    const day = String(formData.get("day") ?? "").trim();

    const input = {
      name: formData.get("name"),
      description: formData.get("description"),
      year: year === "" ? undefined : Number(year),
      month: month === "" ? NaN : Number(month),
      day: day === "" ? NaN : Number(day),
      type: formData.get("type"),
      recurrence: formData.get("recurrence"),
      isActive: formData.get("isActive") === "on",
    };

    const result = createEventDtoSchema.safeParse(input);

    if (!result.success) {
      setErrors(
        result.error.issues.map(
          (issue) => `${issue.path.join(".")}: ${issue.message}`,
        ),
      );
      return;
    }

    const dto: CreateEventDto = result.data;

    setIsSaving(true);

    try {
      await apiClient.createEvent(dto);
      form.reset();
      setIsSaved(true);
    } catch (error) {
      setErrors([
        error instanceof Error
          ? error.message
          : "Не удалось создать событие",
      ]);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <fieldset disabled={isSaving} className="space-y-6">
        <div>
          <label htmlFor="name" className="mb-2 block font-medium">
            Название
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={200}
            className={inputClassName}
            defaultValue=""
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-2 block font-medium">
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className={`${inputClassName} resize-y`}
            defaultValue=""
          />
        </div>

        <fieldset>
          <legend className="mb-2 font-medium">Дата события</legend>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="day" className="mb-2 block text-sm">
                День
              </label>
              <input
                id="day"
                name="day"
                type="number"
                min={1}
                max={31}
                step={1}
                required
                className={inputClassName}
                defaultValue=""
              />
            </div>

            <div>
              <label htmlFor="month" className="mb-2 block text-sm">
                Месяц
              </label>
              <input
                id="month"
                name="month"
                type="number"
                min={1}
                max={12}
                step={1}
                required
                className={inputClassName}
                defaultValue=""
              />
            </div>

            <div>
              <label htmlFor="year" className="mb-2 block text-sm">
                Год (необязательно)
              </label>
              <input
                id="year"
                name="year"
                type="number"
                step={1}
                className={inputClassName}
                defaultValue=""
              />
            </div>
          </div>
        </fieldset>

        <div>
          <label htmlFor="type" className="mb-2 block font-medium">
            Тип события
          </label>
          <select
            id="type"
            name="type"
            className={inputClassName}
            defaultValue="birthday"
          >
            <option value="birthday">День рождения</option>
            <option value="other">Другое</option>
          </select>
        </div>

        <div>
          <label htmlFor="recurrence" className="mb-2 block font-medium">
            Повторение
          </label>
          <select
            id="recurrence"
            name="recurrence"
            className={inputClassName}
            defaultValue="yearly"
          >
            <option value="yearly">Ежегодно</option>
            <option value="none">Без повторения</option>
          </select>
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked
            className="h-5 w-5 accent-gray-900"
          />
          <span>Событие активно</span>
        </label>
      </fieldset>

      {errors.length > 0 && (
        <ul role="alert" className="list-disc space-y-1 pl-5 text-red-700">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}

      {isSaved && (
        <p role="status" className="text-green-700">
          Событие создано в памяти мока.
        </p>
      )}

      <div className="flex items-center gap-3 border-t border-gray-200 pt-6">
        <button
          type="submit"
          disabled={isSaving}
          className="cursor-pointer rounded-md bg-gray-900 px-4 py-2
            text-white hover:bg-gray-700 disabled:cursor-not-allowed
            disabled:opacity-50"
        >
          {isSaving ? "Создание..." : "Создать"}
        </button>

        <Link
          href="/events"
          className="rounded-md border border-gray-300 px-4 py-2
            transition-colors hover:bg-gray-200"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}