export function parseTimeWindow(timeWindow: string | null | undefined): number {
  if (!timeWindow) return 2400;

  const lower = timeWindow.toLowerCase().trim();

  if (lower === "am" || lower === "am delivery") return 800;

  // Try to extract the first time from formats like "10:30am-1pm" or "3pm-6pm"
  const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2] || "0", 10);
    const ampm = timeMatch[3];

    if (ampm === "pm" && hours < 12) hours += 12;
    if (ampm === "am" && hours === 12) hours = 0;

    return hours * 100 + minutes;
  }

  return 2400;
}

export interface Sortable {
  deliveryTimeWindow: string | null;
}

export function sortByTimeWindow<T extends Sortable>(items: T[]): T[] {
  return [...items].sort(
    (a, b) =>
      parseTimeWindow(a.deliveryTimeWindow) -
      parseTimeWindow(b.deliveryTimeWindow)
  );
}
