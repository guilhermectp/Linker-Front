import { getLocalTimeZone, type DateValue } from "@internationalized/date";

/**
 * Converte um DateValue (CalendarDate, CalendarDateTime ou ZonedDateTime)
 * do UCalendar para string ISO (YYYY-MM-DD)
 */
export const dateValueToIso = (date: DateValue | null | undefined): string => {
  if (!date) return "";
  return date.toDate(getLocalTimeZone()).toISOString().split("T")[0]!;
};

// /**
//  * Extrai apenas a parte da data (YYYY-MM-DD) de uma string ISO
//  */
// export const extractDatePart = (dateStr: string): string => {
//   return dateStr.includes("T") ? dateStr.split("T")[0]! : dateStr;
// };

// /**
//  * Converte data ISO para formato brasileiro (DD/MM/YYYY)
//  */
// export const isoToDateBR = (iso: string | null | undefined): string => {
//   if (!iso) return "-";

//   try {
//     const { year, month, day } = parseDateParts(iso);
//     return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
//   } catch {
//     return "Erro ao formatar data";
//   }
// };

/**
 * Converte hora ISO para formato brasileiro (HH:MM)
 */
// export const isoToTimeBR = (iso: string | null | undefined): string => {
//   if (!iso) return "-";

//   if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "Sem horário definido";

//   const date = new Date(iso);
//   if (isNaN(date.getTime())) return "Hora inválida";

//   const time = date.toLocaleTimeString("pt-BR", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   return time === "00:00" ? "Hora não informada" : time;
// };

/**
 * Converte data ISO para CalendarDate do internacionalizado
 */
// export const isoToCalendarDate = (iso: string): CalendarDate => {
//   const { year, month, day } = parseDateParts(iso);
//   return new CalendarDate(year, month, day);
// };

/**
 * Converte CalendarDate para ISO string
 */
// export const calendarDateToIso = (date: CalendarDate): string => {
//   return date.toDate(getLocalTimeZone()).toISOString();
// };

/**
 * Converte CalendarDate para formato brasileiro (DD/MM/YYYY)
 */
// export const calendarDateToDateBR = (date: CalendarDate): string => {
//   const day = String(date.day).padStart(2, "0");
//   const month = String(date.month).padStart(2, "0");
//   return `${day}/${month}/${date.year}`;
// };

/**
 * Formata uma data CalendarDate para exibição em labels (ex: "15 de jan de 2024")
 */
// export const selectedCalendarLabel = (date: CalendarDate) => {
//   const df = new DateFormatter("pt-BR", {
//     dateStyle: "medium",
//   });
//   return df.format(date.toDate(getLocalTimeZone()));
// };

/**
 * Ordena duas strings ISO
 */
// export const sortISO = (a: string, b: string) => a.localeCompare(b);

/**
 * Função auxiliar para formatar data diretamente em componentes
 * (equivalente ao seu código do new Date().toLocaleString)
 */
// export const formatDateTimeBR = (
//   dateStr: string | null | undefined,
// ): string => {
//   if (!dateStr) return "-";

//   try {
//     const date = new Date(dateStr);
//     if (isNaN(date.getTime())) return "Data inválida";

//     return date.toLocaleString("pt-BR", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   } catch {
//     return "Erro ao formatar";
//   }
// };

// const parseDateParts = (
//   dateStr: string,
// ): { year: number; month: number; day: number } => {
//   const dateOnly = extractDatePart(dateStr);
//   const [y, m, d] = dateOnly.split("-").map(Number);

//   if (!y || !m || !d || isNaN(y) || isNaN(m) || isNaN(d)) {
//     throw new Error(`Data inválida: "${dateStr}"`);
//   }

//   if (m < 1 || m > 12 || d < 1 || d > 31) {
//     throw new Error(`Data fora do intervalo: "${dateStr}"`);
//   }

//   return { year: y, month: m, day: d };
// };
