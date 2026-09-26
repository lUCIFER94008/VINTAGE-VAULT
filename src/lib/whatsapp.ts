import { Order } from '@/types';

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919605332248';

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
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

Phone:
${order.phone}

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
