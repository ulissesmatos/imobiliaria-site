"use client";

import { useCallback, useState, useTransition } from "react";
import { useDropzone } from "react-dropzone";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Star, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import {
  deletePropertyImage,
  reorderPropertyImages,
  setCoverImage,
  uploadPropertyImage,
} from "@/lib/actions/property-images";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PropertyImageItem = {
  id: string;
  url: string;
  isCover: boolean;
};

function SortableImage({
  image,
  onSetCover,
  onDelete,
}: {
  image: PropertyImageItem;
  onSetCover: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: image.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group relative aspect-4/3 overflow-hidden rounded-lg border bg-muted",
        isDragging && "z-10 opacity-70"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt=""
        className="h-full w-full object-cover"
        draggable={false}
      />

      <button
        type="button"
        aria-label="Arrastar para reordenar"
        className="absolute top-2 left-2 flex size-7 items-center justify-center rounded-md bg-background/90 text-foreground shadow-sm"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>

      {image.isCover && (
        <span className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
          <Star className="size-3 fill-current" /> Capa
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-background/90 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        {!image.isCover && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 gap-1 text-xs"
            onClick={() => onSetCover(image.id)}
          >
            <Star className="size-3.5" /> Definir capa
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="ml-auto h-7 w-7 p-0 text-destructive hover:text-destructive"
          onClick={() => onDelete(image.id)}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function ImageUploader({
  propertyId,
  initialImages,
}: {
  propertyId: string;
  initialImages: PropertyImageItem[];
}) {
  const [images, setImages] = useState(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true);
      try {
        for (const file of acceptedFiles) {
          const image = await uploadPropertyImage(propertyId, file);
          setImages((prev) => [
            ...prev,
            { id: image.id, url: image.url, isCover: image.isCover },
          ]);
        }
        toast.success(
          acceptedFiles.length > 1
            ? "Fotos enviadas com sucesso!"
            : "Foto enviada com sucesso!"
        );
      } catch {
        toast.error("Não foi possível enviar a foto. Tente novamente.");
      } finally {
        setIsUploading(false);
      }
    },
    [propertyId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: true,
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setImages((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      const next = arrayMove(prev, oldIndex, newIndex);
      startTransition(() => {
        reorderPropertyImages(
          propertyId,
          next.map((i) => i.id)
        );
      });
      return next;
    });
  }

  async function handleSetCover(id: string) {
    setImages((prev) => prev.map((i) => ({ ...i, isCover: i.id === id })));
    await setCoverImage(propertyId, id);
  }

  async function handleDelete(id: string) {
    const previous = images;
    setImages((prev) => prev.filter((i) => i.id !== id));
    try {
      await deletePropertyImage(id);
    } catch {
      setImages(previous);
      toast.error("Não foi possível excluir a foto.");
    }
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className="size-8 text-muted-foreground" />
        <p className="text-sm font-medium">
          {isUploading
            ? "Enviando fotos..."
            : "Arraste fotos aqui ou clique para escolher"}
        </p>
        <p className="text-xs text-muted-foreground">
          JPG, PNG ou WEBP. Pode selecionar várias de uma vez.
        </p>
      </div>

      {images.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((image) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  onSetCover={handleSetCover}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {images.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhuma foto ainda. A primeira foto enviada vira a capa automaticamente.
        </p>
      )}
    </div>
  );
}
