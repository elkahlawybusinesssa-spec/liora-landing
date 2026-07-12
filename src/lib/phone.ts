export function toWhatsappLink(rawPhone: string, message: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  let intl = digits;
  if (digits.startsWith("966")) intl = digits;
  else if (digits.startsWith("05")) intl = "966" + digits.slice(1);
  else if (digits.startsWith("5") && digits.length === 9) intl = "966" + digits;
  else if (digits.startsWith("0")) intl = "966" + digits.slice(1);

  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}
