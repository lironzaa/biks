import { SubjectType } from "../types/subject-type";

export interface Trainee {
  id: string;
  name: string;
  grades: TraineeGrade[];
  email: string;
  dateJoined: string;
  address: string;
  city: string;
  country: string;
  zip: string;
}

export interface TraineeRow {
  id: string;
  gradeId: string;
  name: string;
  email: string;
  dateJoined: string;
  address: string;
  city: string;
  country: string;
  zip: string;
  grade: string;
  subject: SubjectType;
}

export interface TraineeGrade {
  id: string;
  grade: string;
  subject: SubjectType;
  traineeId: string;
}

export interface CreateTrainee {
  traineeData: {
    name: string;
    email: string;
    dateJoined: string;
    address: string;
    city: string;
    country: string;
    zip: string;
  }
  gradeData : CreateTraineeGrade
}

export interface CreateTraineeGrade {
  grade: string;
  subject: SubjectType;
  traineeId: string;
}
