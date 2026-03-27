import { atom } from 'jotai';
import { Enrollment, Student } from '@/types';

interface IEnrollmentFlowState {
  student: Student | null;
  enrollment: Enrollment | null;
}

const defaultEnrollmentFlowState: IEnrollmentFlowState = {
  student: null,
  enrollment: null,
};

// Main atom that holds the entire enrollment flow state
const enrollmentFlowAtom = atom<IEnrollmentFlowState>(
  defaultEnrollmentFlowState,
);

// Clear the entire flow state
export const clearEnrollmentFlowAtom = atom(null, (_get, set, _data) => {
  return set(enrollmentFlowAtom, defaultEnrollmentFlowState);
});

// Student specific atom for the enrollment flow
export const enrollmentFlowStudentAtom = atom(
  (get) => get(enrollmentFlowAtom).student,
  (get, set, data: Student) => {
    const prev = get(enrollmentFlowAtom);
    return set(enrollmentFlowAtom, { ...prev, student: data });
  },
);

// Enrollment specific atom for the flow
export const enrollmentFlowEnrollmentAtom = atom(
  (get) => get(enrollmentFlowAtom).enrollment,
  (get, set, data: Enrollment) => {
    const prev = get(enrollmentFlowAtom);
    return set(enrollmentFlowAtom, { ...prev, enrollment: data });
  },
);
