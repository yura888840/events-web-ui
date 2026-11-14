"use client";

import { COMMON, ERRORS, FORM } from "@/i18n/tokens";
import { Translate } from "@/i18n/translate";
import { translate } from "@/i18n";
import { validationMessage } from "@/i18n/validation";
import { Button, ButtonLink } from "@/components/ui/button";
import { FormFeedback } from "@/components/ui/form-feedback";
import { EventFormFields } from "./event-form-fields";
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
      setErrors(result.error.issues.map((issue) => validationMessage(issue)));
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
        error instanceof Error ? error.message : translate(ERRORS.CREATE),
      ]);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <EventFormFields disabled={isSaving} />

      <FormFeedback
        errors={errors}
        success={isSaved ? translate(FORM.CREATED) : undefined}
      />

      <div className="flex items-center gap-3 border-t border-gray-200 pt-6">
        <Button variant="submit" type="submit" disabled={isSaving}>
          {isSaving ? (
            <Translate token={FORM.CREATING} />
          ) : (
            <Translate token={FORM.CREATE} />
          )}
        </Button>

        <ButtonLink variant="secondary" href="/events">
          <Translate token={COMMON.CANCEL} />
        </ButtonLink>
      </div>
    </form>
  );
}
