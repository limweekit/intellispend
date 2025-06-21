"use client";

import React, { useState } from "react";
import {Lightbulb} from "lucide-react";

function getToken() {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("user");
  if (!stored) return null;
  const parsed = JSON.parse(stored);
  return parsed.access_token || parsed.access || parsed.user?.access_token || null;
}


export default function AdviceStreamer({ goalId }) {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const adviceUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/insights/advice`;
  const token = getToken();

  async function streamAdvice() {
    setAdvice("");
    setLoading(true);
    const response = await fetch(`${adviceUrl}/${goalId}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let fullText = "";

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (value) {
        const chunk = decoder.decode(value);
        fullText += chunk;
        setAdvice(fullText);
      }
      done = streamDone;
    }
    setLoading(false);
  }

  return (
    <div>
      <button
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg text-base font-medium hover:opacity-90"
          onClick={streamAdvice}
          disabled={loading}
      >
         <Lightbulb className="w-6 h-6 text-white" />
         {loading ? "Loading..." : "Get Advice"}
      </button>
      <div className="whitespace-pre-wrap mt-4">{advice}</div>
    </div>
  );
}