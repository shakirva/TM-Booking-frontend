export function formatDateDMY(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '-';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (!d || isNaN(d.getTime())) return '-';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2); // yy
  return `${day}-${month}-${year}`;
}

export function formatDateTimeDMY(dateStr?: string, timeStr?: string): string {
  if (!dateStr) return '-';
  const datePart = formatDateDMY(dateStr);
  return timeStr ? `${datePart} ${timeStr}` : datePart;
}