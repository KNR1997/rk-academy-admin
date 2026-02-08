import {
  CourseOffering,
  CourseOfferingPaginator,
  CourseQueryOptions,
  CreateTeacherInput,
  QueryOptions,
  Teacher,
  TeacherPaginator,
  TeacherQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const teacherClient = {
  ...crudFactory<Teacher, QueryOptions, CreateTeacherInput>(
    API_ENDPOINTS.TEACHERS,
  ),
  paginated: ({ name, ...params }: Partial<TeacherQueryOptions>) => {
    return HttpClient.get<TeacherPaginator>(API_ENDPOINTS.TEACHERS, {
      searchJoin: 'and',
      self,
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
  myCourseOfferingsPaginated: ({
    name,
    ...params
  }: Partial<CourseQueryOptions>) => {
    return HttpClient.get<CourseOfferingPaginator>(
      `${API_ENDPOINTS.TEACHERS}/me/course-offerings`,
      {
        searchJoin: 'and',
        self,
        ...params,
        search: HttpClient.formatSearchParams({ name }),
      },
    );
  },
  myCourseOffering({ id }: { id: string }) {
    return HttpClient.get<CourseOffering>(
      `${API_ENDPOINTS.TEACHERS}/me/course-offerings${id}`,
    );
  },
};
