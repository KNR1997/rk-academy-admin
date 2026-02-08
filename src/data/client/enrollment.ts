import {
  CreateEnrollmentInput,
  Enrollment,
  EnrollmentPaginator,
  EnrollmentQueryOptions,
  EnrollmentWithMonthsPaginator,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const enrollmentClient = {
  ...crudFactory<Enrollment, QueryOptions, CreateEnrollmentInput>(
    API_ENDPOINTS.ENROLLMENTS,
  ),
  paginated: ({ name, grade_level, ...params }: Partial<EnrollmentQueryOptions>) => {
    return HttpClient.get<EnrollmentPaginator>(API_ENDPOINTS.ENROLLMENTS, {
      searchJoin: 'and',
      self,
      ...params,
      search: HttpClient.formatSearchParams({ name, grade_level }),
    });
  },
  enrollmentWithMonthPaginated: ({
    name,
    batch,
    grade_level,
    ...params
  }: Partial<EnrollmentQueryOptions>) => {
    return HttpClient.get<EnrollmentWithMonthsPaginator>(
      API_ENDPOINTS.ENROLLMENTS,
      {
        searchJoin: 'and',
        self,
        ...params,
        search: HttpClient.formatSearchParams({ name, batch, grade_level }),
      },
    );
  },
};
