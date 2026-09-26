/** Real calendar helpers — .ics download + Google Calendar deep link. */

export type CalendarEvent = {
  title: string;
  details: string;
  location: string;
  /** Local datetime-ish string, e.g. "2026-09-26T20:00:00" */
  startIso: string;
  durationMinutes?: number;
};

function toIcsStamp(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

export function buildIcs(event: CalendarEvent): string {
  const start = toIcsStamp(event.startIso);
  const endDate = new Date(
    new Date(event.startIso).getTime() +
      (event.durationMinutes ?? 90) * 60_000
  );
  const end = toIcsStamp(endDate.toISOString());
  const uid = `winged-${Date.now()}@winged.app`;
  const escape = (s: string) =>
    s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Winged//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsStamp(new Date().toISOString())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escape(event.title)}`,
    `DESCRIPTION:${escape(event.details)}`,
    `LOCATION:${escape(event.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs(event: CalendarEvent, filename = "winged-date.ics") {
  const blob = new Blob([buildIcs(event)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function googleCalendarUrl(event: CalendarEvent): string {
  const start = toIcsStamp(event.startIso).replace(/Z$/, "");
  const endDate = new Date(
    new Date(event.startIso).getTime() +
      (event.durationMinutes ?? 90) * 60_000
  );
  const end = toIcsStamp(endDate.toISOString()).replace(/Z$/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.details,
    location: event.location,
    dates: `${start}/${end}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
