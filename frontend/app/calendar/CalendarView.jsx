"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Target, DollarSign, Wallet } from "lucide-react";

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
      "block mx-1 px-2 py-1 rounded-full text-xs font-medium truncate cursor-pointer";
    const colorClasses =
      type === "expense"
        ? "bg-red-500 text-white"
        : type === "income"
        ? "bg-green-500 text-white"
        : "bg-blue-500 text-white";

    return (
      <div className={`${baseClasses} ${colorClasses}`}>
        {eventInfo.event.title}
      </div>
    );
  };

  const handleEventClick = (clickInfo) => {
    const ev = clickInfo.event;
    setSelectedEvent({
      id: ev.id,
      title: ev.title,
      date: ev.startStr,
      type: ev.extendedProps.type,
    });
  };

  return (
    <>
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
          eventClick={handleEventClick}
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

      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-transparent backdrop-blur-md"
            onClick={() => setSelectedEvent(null)}
          />

          <div
            className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-transform duration-200 ease-out hover:scale-105 border-l-8 ${
              selectedEvent.type === "expense"
                ? "border-red-500"
                : selectedEvent.type === "income"
                ? "border-green-500"
                : "border-blue-500"
            }`}
          >
            <div className="flex items-center space-x-3 p-6 pb-2">
              {selectedEvent.type === "expense" ? (
                <Wallet className="w-8 h-8 text-red-500" />
              ) : selectedEvent.type === "income" ? (
                <DollarSign className="w-8 h-8 text-green-500" />
              ) : (
                <Target className="w-8 h-8 text-blue-500" />
              )}
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedEvent.title}
              </h2>
              <button
                className="ml-auto text-gray-400 hover:text-gray-600 text-2xl"
                onClick={() => setSelectedEvent(null)}
              >
                ×
              </button>
            </div>
            <div className="p-6 pt-2 space-y-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Date:</span>{" "}
                {new Date(selectedEvent.date).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Type:</span>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    selectedEvent.type === "expense"
                      ? "bg-red-100 text-red-800"
                      : selectedEvent.type === "income"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {selectedEvent.type}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
