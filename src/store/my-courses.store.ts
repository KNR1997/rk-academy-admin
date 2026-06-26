import { CourseOffering } from "@/types";
import { atom } from "jotai";

interface IMyCoursesState {
    seletctedCourse: CourseOffering | null;
}

const defaultMyCoursesState: IMyCoursesState = {
    seletctedCourse: null,
}

const myCoursesAtom = atom<IMyCoursesState>(
    defaultMyCoursesState
);


