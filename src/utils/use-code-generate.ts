import { GradeType } from "@/types";

export function generateSubjectCode(inputString: string): string {
  if (!inputString) return "";
  /* This line get only the first 3 characters of the word. */
  const firstThreeCharacters = inputString.slice(0, 3);
  /* Return the uppercase version. */
  return firstThreeCharacters.toUpperCase();
}

function generatGradeTypeCode(gradeType: GradeType): string {
  const gradeMap: Record<GradeType, string> = {
    [GradeType.GRADE_6]: "G6",
    [GradeType.GRADE_7]: "G7",
    [GradeType.GRADE_8]: "G8",
    [GradeType.GRADE_9]: "G9",
    [GradeType.GRADE_10]: "G10",
    [GradeType.GRADE_11]: "G11",
  };
  return gradeMap[gradeType] ?? "G";
}

export function generateCourseCode(
  // gradeType: GradeType,
  subject: string,
  // teacherFirstName: string,
  // teacherLastName: string,
  // batch: number
): string {
  // if (!gradeType || !subject || !teacherFirstName || !teacherLastName) return "";

  // const safeSlice = (value: string, length = 3) =>
  //   (value || "").substring(0, length).toUpperCase();

  // const subjectFirstThree = safeSlice(subject);
  // const teacherFirstNameFirstThree = safeSlice(teacherFirstName);
  // const teacherLastNameFirstThree = safeSlice(teacherLastName);
  // const gradeCode = generatGradeTypeCode(gradeType);

  // return `${subjectFirstThree}${gradeCode}B${batch}${teacherFirstNameFirstThree}${teacherLastNameFirstThree}`;
  return subject;
}

export function generateCourseName(
  // gradeType: GradeType,
  subject: string,
  // teacherFirstName: string,
  // teacherLastName: string,
  // batch: number
): string {
  // if (!gradeType || !subject || !teacherFirstName || !teacherLastName) return "";

  // return `${gradeType}-${subject}-Batch-${batch}-${teacherFirstName}-${teacherLastName}`;
  return subject
}
