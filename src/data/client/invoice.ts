import {
  CoursePaginator,
  CreateInvoiceInput,
  Invoice,
  InvoicePaginator,
  InvoiceQueryOptions,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const invoiceClient = {
  ...crudFactory<Invoice, QueryOptions, CreateInvoiceInput>(
    API_ENDPOINTS.INVOICES,
  ),
  paginated: ({ invoice_number, ...params }: Partial<InvoiceQueryOptions>) => {
    return HttpClient.get<InvoicePaginator>(API_ENDPOINTS.INVOICES, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ invoice_number }),
    });
  },
  download: (id: string) => {
    return HttpClient.download(`${API_ENDPOINTS.INVOICES}/${id}/download/`);
  },
};
