import { PaymentStatus } from '@/types';

export const ORDER_STATUS = [
  { name: 'text-invoice-issued', status: 'issued', serial: 1 },
  { name: 'text-invoice-paid', status: 'paid', serial: 2 },
  { name: 'text-invoice-draft', status: 'draft', serial: 3 },
  { name: 'text-invoice-void', status: 'void', serial: 4 },
];

export const filterOrderStatus = (
  orderStatus: any[],
  paymentStatus: PaymentStatus,
  currentStatusIndex: number,
) => {
  if ([PaymentStatus.COMPLETED].includes(paymentStatus)) {
    return currentStatusIndex > 4
      ? [...orderStatus.slice(0, 4), orderStatus[currentStatusIndex]]
      : orderStatus.slice(0, 5);
  }

  return currentStatusIndex > 1
    ? [...orderStatus.slice(0, 1), orderStatus[currentStatusIndex]]
    : orderStatus.slice(0, 2);
};
