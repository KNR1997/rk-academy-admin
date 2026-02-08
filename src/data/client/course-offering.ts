import {
  CourseOffering,
  CourseOfferingPaginator,
  CourseOfferingQueryOptions,
  CreateCourseOfferingInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const courseOfferingClient = {
  ...crudFactory<CourseOffering, QueryOptions, CreateCourseOfferingInput>(
    API_ENDPOINTS.COURSE_OFFERING,
  ),
  paginated: ({ grade_level, ...params }: Partial<CourseOfferingQueryOptions>) => {
    return HttpClient.get<CourseOfferingPaginator>(API_ENDPOINTS.COURSE_OFFERING, {
      searchJoin: 'and',
      self,
      ...params,
      search: HttpClient.formatSearchParams({ grade_level }),
    });
  },
};
