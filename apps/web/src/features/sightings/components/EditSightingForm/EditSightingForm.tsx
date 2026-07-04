"use client";

import type { SightingResponse } from "@bomberman/types";
import { useForm } from "react-hook-form";

import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";

import { useUpdateSighting } from "../../hooks/use-sighting-mutations";

interface EditSightingFormProps {
  sighting: SightingResponse;
}

interface EditValues {
  title: string;
  description: string;
}

export function EditSightingForm({ sighting }: EditSightingFormProps): JSX.Element {
  const update = useUpdateSighting(sighting.id);
  const { register, handleSubmit } = useForm<EditValues>({
    defaultValues: {
      title: sighting.title,
      description: sighting.description ?? "",
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit((values) =>
        update.mutate({
          title: values.title,
          description: values.description.trim() ? values.description : null,
        }),
      )}
    >
      <FormField label="Título" {...register("title", { required: true })} />
      <FormField label="Descrição" {...register("description")} />
      <Button type="submit" fullWidth isLoading={update.isPending}>
        Salvar alterações
      </Button>
    </form>
  );
}
