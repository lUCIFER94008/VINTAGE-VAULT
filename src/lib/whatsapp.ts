import { Order } from '@/types';

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919605332248';

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatPhoneNumber(phone?: string): string {
  if (!phone) return '';
  const cleaned = phone.trim().replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+91')) {
    const digits = cleaned.slice(3);
    return digits.length === 10 ? `+91 ${digits}` : cleaned;
  }
  if (cleaned.length === 10) {
    return `+91 ${cleaned}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2)}`;
  }
  return phone;
}

export function generateWhatsAppMessage(order: Partial<Order>): string {
  const itemsText = (order.items || [])
    .map((item, index) => {
      let text = `${index + 1}. ${item.name}\nSize: ${item.size}\nColor: ${item.color}\nQuantity: ${item.quantity}\nPrice: ${formatCurrency(item.price)}`;
      if (item.image) {
        text += `\nProduct Image: ${item.image}`;
      }
      return text;
    })
    .join('\n\n');

  const landmarkText = order.landmark ? `\nLandmark: ${order.landmark}` : '';
  const additionalPhoneText = order.additionalPhone
    ? `\n\nAdditional Phone:\n${formatPhoneNumber(order.additionalPhone)}`
    : '';

  const message = `Hello VINTAGE VAULT 👋

I would like to place an order.

ORDER ID:
${order.orderId || 'VV-PENDING'}

PRODUCT DETAILS:

${itemsText}

TOTAL:
${formatCurrency(order.totalAmount || 0)}

CUSTOMER DETAILS:

Name:
${order.customerName}

Primary Phone:
${formatPhoneNumber(order.phone)}${additionalPhoneText}

DELIVERY ADDRESS:

${order.address}
${order.city}, ${order.state} - ${order.pincode}${landmarkText}

Please confirm my order.

Thank you.

VINTAGE VAULT`;

  return message;
}

export function generateWhatsAppURL(order: Partial<Order>): string {
  const cleanNumber = WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
  const message = generateWhatsAppMessage(order);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}
