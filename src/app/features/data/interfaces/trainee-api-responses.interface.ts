import { SubjectType } from "../types/subject-type";

export interface CreateUpdateDeleteTraineeResponse {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
  address: string;
  city: string;
  country: string;
  zip: string;
}

export interface CreateOrUpdateGradeResponse {
  id: string;
  grade: string;
  subject: SubjectType;
  traineeId: string;
}
