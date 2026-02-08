import { CourseType, GradeType } from '@/types';

export const gradeOptions = [
  { value: GradeType.GRADE_6, label: 'Grade 6' },
  { value: GradeType.GRADE_7, label: 'Grade 7' },
  { value: GradeType.GRADE_8, label: 'Grade 8' },
  { value: GradeType.GRADE_9, label: 'Grade 9' },
  { value: GradeType.GRADE_10, label: 'Grade 10' },
  { value: GradeType.GRADE_11, label: 'Grade 11' },
];

export const courseTypeOptions = [
  { value: CourseType.ONLINE, label: 'ONLINE' },
  { value: CourseType.PHYSICAL, label: 'PHYSICAL' },
];

export const monthOptions = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];
