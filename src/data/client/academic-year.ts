import {
  AcademicYear,
  AcademicYearPaginator,
  AcademicYearQueryOptions,
  CreateAcademicYearInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const academicYearClient = {
  ...crudFactory<AcademicYear, QueryOptions, CreateAcademicYearInput>(
    API_ENDPOINTS.ACADEMIC_YEARS,
  ),
  paginated: ({ name, ...params }: Partial<AcademicYearQueryOptions>) => {
    return HttpClient.get<AcademicYearPaginator>(API_ENDPOINTS.ACADEMIC_YEARS, {
      searchJoin: 'and',
      self,
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
