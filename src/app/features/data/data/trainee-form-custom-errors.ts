import { TraineeFormCustomErrorsInterface } from "../interfaces/trainee-form-custom-errors.interface";

export const TraineeFormCustomErrorsData: TraineeFormCustomErrorsInterface = {
  name: {
    required: () => "Name is required field"
  },
  grade: {
    required: () => "Grade is required field"
  },
  email: {
    required: () => "Email is required field",
    pattern: () => "The field must be valid email"
  },
  dateJoined: {
    required: () => "Date joined is required field"
  },
  subject: {
    required: () => "Subject is required field"
  },
}
