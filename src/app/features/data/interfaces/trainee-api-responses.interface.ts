import { SubjectType } from "../types/subject-type";

export interface CreateTraineeResponse {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
  address: string;
  city: string;
  country: string;
  zip: string;
}

export interface CreateGradeResponse {
  id: string;
  grade: string;
  subject: SubjectType;
  traineeId: string;
}
