import { useQuery } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Course, CoursePaginator, StudentEnrolledCourseQueryOptions } from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { StudentEnrolledCourseClient } from './client/student-enrolled-course';

export const useStudentEnrolledCoursesQuery = ({
  student_id,
  enabled = true,
}: {
  student_id?: string;
  enabled?: boolean;
}) => {
  const { data, error, isLoading } = useQuery<Course[], Error>(
    [API_ENDPOINTS.STUDENTS, { student_id }],
    ({ queryKey, pageParam }) =>
      StudentEnrolledCourseClient.paginated(
        Object.assign({}, queryKey[1], pageParam),
      ),
    {
      enabled: enabled && !!student_id,
      // keepPreviousData: true,
    },
  );

  return {
    courses: data ?? [],
    // paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
