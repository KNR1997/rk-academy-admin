import { Course, CoursePaginator, StudentEnrolledCourseQueryOptions } from '@/types';
import { HttpClient } from './http-client';

export const StudentEnrolledCourseClient = {
  paginated: ({ student_id }: { student_id?: string }) => {
    if (!student_id) {
      throw new Error('student_id is required');
    }
    return HttpClient.get<Course[]>(
      `students/${student_id}/enrolled-courses/`,
    );
  },
};
