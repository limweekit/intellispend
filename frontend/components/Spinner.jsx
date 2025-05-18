"use client";

import { Loader2 } from "lucide-react";
import { useLoading } from "@/context/LoadingContext";

export default function Spinner() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Loader2 className="h-10 w-10 animate-spin text-white" />
    </div>
  );
}