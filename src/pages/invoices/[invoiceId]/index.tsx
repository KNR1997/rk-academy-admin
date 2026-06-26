import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import usePrice from '@/utils/use-price';
import { useIsRTL } from '@/utils/locals';
import { formatString } from '@/utils/format-string';
import { ORDER_STATUS } from '@/utils/order-status';
// types
import { InvoiceLineItem, OrderStatus, PaymentStatus } from '@/types';
// client
import { invoiceClient } from '@/data/client/invoice';
// hooks
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useInvoiceQuery, useUpdateInvoiceMutation } from '@/data/invoice';
// components
import Card from '@/components/common/card';
import Button from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import Layout from '@/components/layouts/admin';
import Loader from '@/components/ui/loader/loader';
import { PayIcon } from '@/components/icons/pay-icon';
import SelectInput from '@/components/ui/select-input';
import ErrorMessage from '@/components/ui/error-message';
import { NoDataFound } from '@/components/icons/no-data-found';
import { DownloadIcon } from '@/components/icons/download-icon';
import ValidationError from '@/components/ui/form-validation-error';
import InvoiceViewHeader from '@/components/invoice/invoice-view-header';
import OrderStatusProgressBox from '@/components/invoice/order-status-progress-box';

type FormValues = {
  order_status: any;
};
export default function InvoiceDetailsPage() {
  const { query } = useRouter();
  const { t } = useTranslation();
  const { openModal } = useModalAction();
  const { alignLeft, alignRight } = useIsRTL();

  const {
    invoice,
    isLoading: loading,
    error,
  } = useInvoiceQuery({ slug: query.invoiceId as string });

  const { mutate: updateInvoice, isLoading: updating } =
    useUpdateInvoiceMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { order_status: invoice?.status ?? '' },
  });

  const ChangeStatus = ({ order_status }: FormValues) => {
    updateInvoice({
      id: invoice?.id as string,
      status: order_status?.status as string,
    });
  };

  const { price: total } = usePrice(
    invoice && {
      amount: Number(invoice?.total_amount),
    },
  );

  const { price: sales_tax } = usePrice(
    invoice && {
      amount: Number(invoice?.tax_amount),
    },
  );
  const { price: sub_total } = usePrice({ amount: Number(invoice?.subtotal) });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handlePayInvoice() {
    openModal('PAYMENT_VIEW', {
      invoiceId: invoice?.id,
      amount: invoice?.total_amount,
    });
  }

  async function handleDownloadInvoice() {
    try {
      // Now this will return a Blob directly
      const blob = await invoiceClient.download(invoice?.id as string);

      // Verify it's a Blob
      if (!(blob instanceof Blob)) {
        console.error('Response is not a Blob:', blob);
        throw new Error('Invalid response format');
      }

      // Check if blob has content
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoice?.invoice_number || invoice?.id}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(t('common:invoice-downloaded-successfully'));
    } catch (error: any) {
      console.error('Error downloading invoice:', error);

      // Check if error has response data (JSON error message)
      if (error.response?.data) {
        // Try to parse as JSON for error message
        try {
          const errorData = await error.response.data.text();
          const parsedError = JSON.parse(errorData);
          toast.error(
            parsedError.detail || t('common:error-downloading-invoice'),
          );
        } catch {
          toast.error(t('common:error-downloading-invoice'));
        }
      } else {
        toast.error(error.message || t('common:error-downloading-invoice'));
      }
    }
  }

  const columns = [
    // {
    //   dataIndex: 'image',
    //   key: 'image',
    //   width: 70,
    //   render: (image: Attachment) => (
    //     <div className="relative h-[50px] w-[50px]">
    //       <Image
    //         src={image?.thumbnail ?? siteSettings.product.placeholder}
    //         alt="alt text"
    //         fill
    //         sizes="(max-width: 768px) 100vw"
    //         className="object-fill"
    //       />
    //     </div>
    //   ),
    // },
    {
      title: t('table:table-item-products'),
      dataIndex: 'description',
      key: 'description',
      align: alignLeft,
      render: (description: string, item: InvoiceLineItem) => (
        <div>
          <span>{description}</span>
          <span className="mx-2">x</span>
          <span className="font-semibold text-heading">{item.quantity}</span>
        </div>
      ),
    },
    {
      title: t('table:table-item-total'),
      dataIndex: 'line_total',
      key: 'line_total',
      align: alignRight,
      render: function Render(_: any, item: InvoiceLineItem) {
        const { price } = usePrice({
          amount: parseFloat(item.line_total),
        });
        return <span>{price}</span>;
      },
    },
  ];

  return (
    <>
      <Card className="relative overflow-hidden">
        <div className="mb-6 -mt-5 -ml-5 -mr-5 md:-mr-8 md:-ml-8 md:-mt-8">
          <InvoiceViewHeader invoice={invoice} wrapperClassName="px-8 py-4" />
        </div>
        <div className="flex justify-end gap-2 mb-5">
          <Button
            onClick={handlePayInvoice}
            disabled={invoice?.payment?.status == PaymentStatus.COMPLETED}
            className="bg-blue-500"
          >
            <PayIcon className="h-6 w-6 me-3" />
            Pay Invoice
          </Button>
          <Button onClick={handleDownloadInvoice} className="bg-blue-500">
            <DownloadIcon className="h-4 w-4 me-3" />
            {t('common:text-download')} {t('common:text-invoice')}
          </Button>
        </div>

        <div className="flex flex-col items-center lg:flex-row">
          <h3 className="mb-8 w-full whitespace-nowrap text-center text-2xl font-semibold text-heading lg:mb-0 lg:w-1/3 lg:text-start">
            {t('form:input-label-invoice-number')} - {invoice?.invoice_number}
          </h3>

          {![
            OrderStatus.FAILED,
            OrderStatus.CANCELLED,
            OrderStatus.REFUNDED,
          ].includes(invoice?.status! as OrderStatus) && (
            <form
              onSubmit={handleSubmit(ChangeStatus)}
              className="flex w-full items-start ms-auto lg:w-2/4"
            >
              <div className="z-20 w-full me-5">
                <SelectInput
                  name="order_status"
                  control={control}
                  getOptionLabel={(option: any) => t(option.name)}
                  getOptionValue={(option: any) => option.status}
                  options={ORDER_STATUS.slice(2, 4)}
                  placeholder={t('form:input-placeholder-order-status')}
                  disabled={invoice?.payment?.status == PaymentStatus.COMPLETED}
                />

                <ValidationError message={t(errors?.order_status?.message)} />
              </div>
              <Button
                loading={updating}
                disabled={invoice?.payment?.status == PaymentStatus.COMPLETED}
              >
                <span className="hidden sm:block">
                  {t('form:button-label-change-status')}
                </span>
                <span className="block sm:hidden">
                  {t('form:form:button-label-change')}
                </span>
              </Button>
            </form>
          )}
        </div>

        <div className="my-5 flex items-center justify-center lg:my-10">
          <OrderStatusProgressBox
            orderStatus={invoice?.status as OrderStatus}
            paymentStatus={'pending' as PaymentStatus}
          />
        </div>

        <div className="mb-10">
          {invoice ? (
            <Table
              //@ts-ignore
              columns={columns}
              emptyText={() => (
                <div className="flex flex-col items-center py-7">
                  <NoDataFound className="w-52" />
                  <div className="mb-1 pt-6 text-base font-semibold text-heading">
                    {t('table:empty-table-data')}
                  </div>
                  <p className="text-[13px]">
                    {t('table:empty-table-sorry-text')}
                  </p>
                </div>
              )}
              data={invoice?.line_items!}
              rowKey="id"
              scroll={{ x: 300 }}
            />
          ) : (
            <span>{t('common:no-order-found')}</span>
          )}

          <div className="flex w-full flex-col space-y-2 border-t-4 border-double border-border-200 px-4 py-4 ms-auto sm:w-1/2 md:w-1/3">
            <div className="flex items-center justify-between text-sm text-body">
              <span>{t('common:order-sub-total')}</span>
              <span>{sub_total}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-body">
              <span> {t('text-tax')}</span>
              <span>{sales_tax}</span>
            </div>
            {/* {invoice?.discount_amount! > 0 && (
                  <div className="flex items-center justify-between text-sm text-body">
                    <span>{t('text-discount')}</span>
                    <span>{discount}</span>
                  </div>
                )} */}

            <div className="flex items-center justify-between text-base font-semibold text-heading">
              <span> {t('text-total')}</span>
              <span>{total}</span>
            </div>
          </div>
        </div>

        {invoice?.notes ? (
          <div>
            <h2 className="mt-12 mb-5 text-xl font-bold text-heading">
              Purchase Note
            </h2>
            <div className="mb-12 flex items-start rounded border border-gray-700 bg-gray-100 p-4">
              {invoice?.notes}
            </div>
          </div>
        ) : (
          ''
        )}

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="mb-10 w-full sm:mb-0 sm:w-1/2 sm:pe-8">
            <h3 className="mb-3 border-b border-border-200 pb-2 font-semibold text-heading">
              {t('text-invoice-details')}
            </h3>

            <div className="flex flex-col items-start space-y-1 text-sm text-body">
              <span>
                {formatString(invoice?.line_items?.length, t('text-item'))}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
InvoiceDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
