import {
  CreateSubjectInput,
  QueryOptions,
  Subject,
  SubjectPaginator,
  SubjectQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const subjectClient = {
  ...crudFactory<Subject, QueryOptions, CreateSubjectInput>(
    API_ENDPOINTS.SUBJECTS
  ),
  paginated: ({ name, ...params }: Partial<SubjectQueryOptions>) => {
    return HttpClient.get<SubjectPaginator>(API_ENDPOINTS.SUBJECTS, {
      searchJoin: 'and',
      self,
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
