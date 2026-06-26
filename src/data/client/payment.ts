import {
  CoursePaginator,
  CreatePaymentInput,
  Payment,
  PaymentQueryOptions,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const paymentClient = {
  ...crudFactory<Payment, QueryOptions, CreatePaymentInput>(
    API_ENDPOINTS.PAYMENTS,
  ),
  paginated: ({ payment_number, ...params }: Partial<PaymentQueryOptions>) => {
    return HttpClient.get<CoursePaginator>(API_ENDPOINTS.PAYMENTS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ payment_number }),
    });
  },
};
