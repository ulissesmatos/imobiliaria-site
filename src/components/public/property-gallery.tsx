"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function PropertyGallery({
  images,
  title,
}: {
  images: { id: string; url: string }[];
  title: string;
}) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-16/9 items-center justify-center rounded-lg bg-muted">
        <Building2 className="size-16 text-muted-foreground/40" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="aspect-16/9 overflow-hidden rounded-lg bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[selected].url}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelected(index)}
              className={cn(
                "size-16 shrink-0 overflow-hidden rounded-md border-2",
                selected === index ? "border-primary" : "border-transparent"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
