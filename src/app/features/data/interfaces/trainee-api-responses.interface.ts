import { SubjectType } from '../types/subject-type';

export interface CreateUpdateDeleteTraineeResponse {
  address: string;
  city: string;
  country: string;
  dateJoined: string;
  email: string;
  id: string;
  name: string;
  zip: string;
}

export interface CreateOrUpdateGradeResponse {
  date: string;
  grade: number;
  id: string;
  subject: SubjectType;
  traineeId: string;
}
