import {
  CreateEnrollmentPaymentInput,
  EnrollmentPaginator,
  EnrollmentPayment,
  EnrollmentPaymentPaginator,
  EnrollmentPaymentQueryOptions,
  EnrollmentPendingPaymentQueryOptions,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const enrollmentPaymentClient = {
  ...crudFactory<EnrollmentPayment, QueryOptions, CreateEnrollmentPaymentInput>(
    API_ENDPOINTS.ENROLLMENT_PAYMENTS,
  ),
  paginated: ({ name, ...params }: Partial<EnrollmentPaymentQueryOptions>) => {
    return HttpClient.get<EnrollmentPaymentPaginator>(
      API_ENDPOINTS.ENROLLMENT_PAYMENTS,
      {
        searchJoin: 'and',
        self,
        ...params,
        search: HttpClient.formatSearchParams({ name }),
      },
    );
  },
  pendingPayments: ({
    name,
    ...params
  }: Partial<EnrollmentPendingPaymentQueryOptions>) => {
    return HttpClient.get<EnrollmentPaginator>(
      `${API_ENDPOINTS.ENROLLMENT_PAYMENTS}/pending-payments`,
      {
        searchJoin: 'and',
        self,
        ...params,
        search: HttpClient.formatSearchParams({ name }),
      },
    );
  },
};
