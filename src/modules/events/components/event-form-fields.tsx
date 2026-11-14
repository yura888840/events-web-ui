"use client";
import {
  FIELDS_ACTIVE,
  FIELDS_DAY,
  FIELDS_DESCRIPTION,
  FIELDS_EVENT_DATE,
  FIELDS_MONTH,
  FIELDS_NAME,
  FIELDS_RECURRENCE,
  FIELDS_TYPE,
  FIELDS_YEAR,
  RECURRENCE_NONE,
  RECURRENCE_YEARLY,
  TYPES_BIRTHDAY,
  TYPES_OTHER,
} from "@/i18n/tokens";
import { Translate } from "@/i18n/translate";
import { useId } from "react";
import {
  Input,
  Textarea,
  Select,
  Checkbox,
} from "@/components/ui/form-controls";
import type { EventFormValues } from "../model/event-form";

export const emptyEventFormValues: EventFormValues = {
  name: "",
  description: "",
  day: "",
  month: "",
  year: "",
  type: "birthday",
  recurrence: "yearly",
  isActive: true,
};
export function EventFormFields({
  initialValues = emptyEventFormValues,
  disabled = false,
}: {
  initialValues?: EventFormValues;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <fieldset disabled={disabled} className="space-y-6">
      <div>
        <label htmlFor={`${id}-name`} className="mb-2 block font-medium">
          <Translate token={FIELDS_NAME} />
        </label>
        <Input
          id={`${id}-name`}
          name="name"
          type="text"
          required
          maxLength={200}
          defaultValue={initialValues.name}
        />
      </div>

      <div>
        <label htmlFor={`${id}-description`} className="mb-2 block font-medium">
          <Translate token={FIELDS_DESCRIPTION} />
        </label>
        <Textarea
          id={`${id}-description`}
          name="description"
          rows={4}
          defaultValue={initialValues.description}
        />
      </div>

      <fieldset>
        <legend className="mb-2 font-medium">
          <Translate token={FIELDS_EVENT_DATE} />
        </legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor={`${id}-day`} className="mb-2 block text-sm">
              <Translate token={FIELDS_DAY} />
            </label>
            <Input
              id={`${id}-day`}
              name="day"
              type="number"
              min={1}
              max={31}
              step={1}
              required
              defaultValue={initialValues.day}
            />
          </div>

          <div>
            <label htmlFor={`${id}-month`} className="mb-2 block text-sm">
              <Translate token={FIELDS_MONTH} />
            </label>
            <Input
              id={`${id}-month`}
              name="month"
              type="number"
              min={1}
              max={12}
              step={1}
              required
              defaultValue={initialValues.month}
            />
          </div>

          <div>
            <label htmlFor={`${id}-year`} className="mb-2 block text-sm">
              <Translate token={FIELDS_YEAR} />
            </label>
            <Input
              id={`${id}-year`}
              name="year"
              type="number"
              step={1}
              defaultValue={initialValues.year}
            />
          </div>
        </div>
      </fieldset>

      <div>
        <label htmlFor={`${id}-type`} className="mb-2 block font-medium">
          <Translate token={FIELDS_TYPE} />
        </label>
        <Select id={`${id}-type`} name="type" defaultValue={initialValues.type}>
          <option value="birthday">
            <Translate token={TYPES_BIRTHDAY} />
          </option>
          <option value="other">
            <Translate token={TYPES_OTHER} />
          </option>
        </Select>
      </div>

      <div>
        <label htmlFor={`${id}-recurrence`} className="mb-2 block font-medium">
          <Translate token={FIELDS_RECURRENCE} />
        </label>
        <Select
          id={`${id}-recurrence`}
          name="recurrence"
          defaultValue={initialValues.recurrence}
        >
          <option value="yearly">
            <Translate token={RECURRENCE_YEARLY} />
          </option>
          <option value="none">
            <Translate token={RECURRENCE_NONE} />
          </option>
        </Select>
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <Checkbox name="isActive" defaultChecked={initialValues.isActive} />
        <span>
          <Translate token={FIELDS_ACTIVE} />
        </span>
      </label>
    </fieldset>
  );
}
