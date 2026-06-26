import { useTranslation } from 'next-i18next';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { Invoice, OrderStatus, PaymentGateway, PaymentStatus } from '@/types';
import Button from '@/components/ui/button';
import cn from 'classnames';
import StatusColor from '@/components/invoice/status-color';
import Badge from '@/components/ui/badge/badge';

interface OrderViewHeaderProps {
  invoice: Invoice;
  wrapperClassName?: string;
  buttonSize?: 'big' | 'medium' | 'small';
}

export default function InvoiceViewHeader({
  invoice,
  wrapperClassName = 'px-11 py-5',
  buttonSize = 'medium',
}: OrderViewHeaderProps) {
  const { t } = useTranslation('common');
  const payment = invoice?.payment;
  const paymentStatus = payment ? payment.status : 'payment-pending';

  // const isPaymentCOD = [PaymentGateway.COD, PaymentGateway.CASH].includes(order?.payment_gateway);
  // const isOrderPending = ![OrderStatus.CANCELLED, OrderStatus.FAILED].includes(order?.order_status);
  // const isPaymentActionPending = !isPaymentCOD && isOrderPending && order?.payment_status !== PaymentStatus.SUCCESS;

  return (
    <div className={cn(`bg-[#F7F8FA] ${wrapperClassName}`)}>
      <div className="mb-0 flex flex-col flex-wrap items-center justify-between gap-x-8 text-base font-bold text-heading sm:flex-row lg:flex-nowrap">
        <div
          className={`order-2 flex  w-full gap-6 sm:order-1 ${
            !false
              ? 'max-w-full basis-full justify-between'
              : 'max-w-full basis-full justify-between lg:ltr:mr-auto'
          }`}
        >
          <div>
            <span className="mb-2 block lg:mb-0 lg:inline-block lg:ltr:mr-4 lg:rtl:ml-4">
              {t('text-invoice-status')} :
            </span>
            <Badge
              text={t(invoice?.status)}
              color={StatusColor(invoice?.status)}
              className="capitalize"
            />
          </div>
          <div>
            <span className="mb-2 block lg:mb-0 lg:inline-block lg:ltr:mr-4 lg:rtl:ml-4">
              {t('text-payment-status')} :
            </span>
            <Badge
              text={t(paymentStatus)}
              color={StatusColor(paymentStatus)}
              className="capitalize"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
