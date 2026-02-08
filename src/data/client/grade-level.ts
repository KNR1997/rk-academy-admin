import {
  CreateGradeLevelInput,
  GradeLevel,
  GradeLevelPaginator,
  GradeLevelQueryOptions,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const gradeLevelClient = {
  ...crudFactory<GradeLevel, QueryOptions, CreateGradeLevelInput>(
    API_ENDPOINTS.GRADE_LEVEL
  ),
  paginated: ({ name, ...params }: Partial<GradeLevelQueryOptions>) => {
    return HttpClient.get<GradeLevelPaginator>(API_ENDPOINTS.GRADE_LEVEL, {
      searchJoin: 'and',
      self,
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
