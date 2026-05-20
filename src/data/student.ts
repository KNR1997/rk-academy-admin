import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { API_ENDPOINTS } from './client/api-endpoints';
import { useMutation, useQuery, useQueryClient } from 'react-query';
// utils
import { mapPaginatorData } from '@/utils/data-mappers';
// client
import { studentClient } from './client/student';
import {
  Enrollment,
  GetParams,
  Student,
  StudentPaginator,
  StudentQueryOptions,
} from '@/types';

export const useCreateStudentMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(studentClient.create, {
    onSuccess: () => {
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.STUDENTS);
    },
  });
};

export const useDeleteStudentMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(studentClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.STUDENTS);
    },
  });
};

export const useUpdateStudentMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation(studentClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.STUDENTS);
    },
  });
};

export const useStudentQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Student, Error>(
    [API_ENDPOINTS.STUDENTS, { slug, language }],
    () => studentClient.get({ slug, language }),
  );

  return {
    student: data,
    error,
    isLoading,
  };
};

export const useStudentsQuery = (options: Partial<StudentQueryOptions>) => {
  const { data, error, isLoading } = useQuery<StudentPaginator, Error>(
    [API_ENDPOINTS.STUDENTS, options],
    ({ queryKey, pageParam }) =>
      studentClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    students: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useStudentEnrollmentsQuery = ({
  studentId,
}: {
  studentId: string;
}) => {
  const { data, error, isLoading } = useQuery<Enrollment[], Error>(
    [`${API_ENDPOINTS.STUDENTS}/${studentId}/enrollments`],
    ({ queryKey, pageParam }) => studentClient.enrollments(studentId),
    {
      keepPreviousData: true,
      enabled: !!studentId,
    },
  );

  return {
    enrollments: data ?? [],
    // paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
