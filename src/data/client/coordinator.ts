import {
  Coordinator,
  CoordinatorPaginator,
  CoordinatorQueryOptions,
  CreateCoordinatorInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const coordinatorClient = {
  ...crudFactory<Coordinator, QueryOptions, CreateCoordinatorInput>(
    API_ENDPOINTS.COORDINATORS,
  ),
  paginated: ({ name, ...params }: Partial<CoordinatorQueryOptions>) => {
    return HttpClient.get<CoordinatorPaginator>(API_ENDPOINTS.COORDINATORS, {
      searchJoin: 'and',
      self,
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
