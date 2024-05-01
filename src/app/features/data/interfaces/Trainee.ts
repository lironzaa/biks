import { Subject } from "./Subject";

export interface Trainee {
  id: string;
  name: string;
  grades: TraineeGrade[];
  email: string;
  dateJoined: Date;
  address: string;
  city: string;
  country: string;
  zip: number;
}

export interface TraineeGrade {
  grade: number;
  subject: Subject;
}
