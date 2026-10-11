/**
 * Formatting utilities for dates, phone numbers, and BDT currency
 */

export function formatCurrency(amount: number): string {
  return `Tk ${amount.toLocaleString("en-BD")}`;
}

export function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

export function formatTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return phone;
}

export function maskPhone(phone: string): string {
  if (phone.length <= 6) return phone;
  return `${phone.slice(0, 4)}***${phone.slice(-3)}`;
}

export function maskName(name: string): string {
  if (name.length <= 2) return name;
  return `${name.charAt(0)}***${name.slice(-1)}`;
}
