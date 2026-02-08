import {
  CreateEnrollmentPaymentInput,
  EnrollmentPayment,
  EnrollmentPaymentPaginator,
  EnrollmentPaymentQueryOptions,
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
};
