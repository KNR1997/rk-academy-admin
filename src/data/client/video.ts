import {
  CreateVideo,
  QueryOptions,
  Video,
  VideoPaginator,
  VideoQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const videoClient = {
  ...crudFactory<Video, QueryOptions, CreateVideo>(API_ENDPOINTS.VIDEOS),
  paginated: ({ name, ...params }: Partial<VideoQueryOptions>) => {
    return HttpClient.get<VideoPaginator>(API_ENDPOINTS.VIDEOS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
