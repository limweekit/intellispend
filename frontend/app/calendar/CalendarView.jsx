"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarView() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      let token = null;
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("user");
        if (stored) {
          const p = JSON.parse(stored);
          token = p.access_token || p.access || p.user?.access_token || null;
        }
      }

      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/calendar/events/`;
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(res.statusText);
        setEvents(await res.json());
      } catch (err) {
        console.error("Fetch calendar events failed:", err);
      }
    }
    fetchEvents();
  }, []);

  const renderEvent = (eventInfo) => {
    const { type } = eventInfo.event.extendedProps;
    const baseClasses =
      "block mx-1 px-2 py-1 rounded-full text-xs font-medium border-none truncate";
    const colorClasses =
      type === "expense"
        ? "bg-red-500 text-white"
        : type === "income"
        ? "bg-green-500 text-white"
        : "bg-blue-500 text-white";
    return (
      <div
        className={`${baseClasses} ${colorClasses}`}
        style={{ maxWidth: "calc(100% - 0.5rem)" }}
      >
        {eventInfo.event.title}
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-inner border border-gray-100">
      <FullCalendar
        className="text-gray-900"
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek",
        }}
        headerToolbarClassNames={() =>
          "mb-4 border-b-2 border-gray-600 bg-white text-gray-900 font-extrabold py-2"
        }
        eventBorderColor="transparent"
        eventBackgroundColor="transparent"
        height="auto"
        contentHeight="auto"
        dayMaxEventRows={3}
        events={events}
        eventContent={renderEvent}
        dayCellClassNames={() =>
          "p-2 bg-white border border-gray-600 text-gray-800"
        }
        dayHeaderClassNames={() =>
          "bg-gray-200 text-gray-800 border-b border-gray-600"
        }
        titleFormat={{ year: "numeric", month: "long" }}
        navLinks={true}
        selectable={false}
      />
    </div>
  );
}