import {
  CourseOffering,
  CourseOfferingEnrollmentQueryOptions,
  CourseOfferingPaginator,
  CourseOfferingQueryOptions,
  CreateCourseOfferingInput,
  EnrollmentPaginator,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const courseOfferingClient = {
  ...crudFactory<CourseOffering, QueryOptions, CreateCourseOfferingInput>(
    API_ENDPOINTS.COURSE_OFFERING,
  ),
  paginated: ({
    grade_level,
    ...params
  }: Partial<CourseOfferingQueryOptions>) => {
    return HttpClient.get<CourseOfferingPaginator>(
      API_ENDPOINTS.COURSE_OFFERING,
      {
        searchJoin: 'and',
        self,
        ...params,
        search: HttpClient.formatSearchParams({ grade_level }),
      },
    );
  },
  enrollmentsPaginated: ({
    course_offering_id,
    grade_level,
    ...params
  }: Partial<CourseOfferingEnrollmentQueryOptions>) => {
    return HttpClient.get<EnrollmentPaginator>(
      `${API_ENDPOINTS.COURSE_OFFERING}/${course_offering_id}/enrollments/`,
      {
        searchJoin: 'and',
        self,
        ...params,
        search: HttpClient.formatSearchParams({ grade_level }),
      },
    );
  },
};
