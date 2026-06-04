"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/utils/utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  src,
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  const validSrc =
    typeof src === "string" &&
    src.startsWith("http") &&
    imageExtensions.some((ext) => src.toLowerCase().includes(ext))
      ? src
      : undefined;
  if (!validSrc) return null;
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      src={validSrc}
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-brand-50 flex size-full text-brand-500 text-base font-extrabold font-jakarta items-center justify-center rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
