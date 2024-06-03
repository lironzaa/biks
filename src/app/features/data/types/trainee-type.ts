import { Trainee, TraineeGrade } from "../interfaces/trainee-interface";

export type TraineeCreateData = Omit<Trainee, "id" | "average" | "exams" | "dynamicTrClass" | "grades">;

export type GradeCreateData = Omit<TraineeGrade, "id">;
