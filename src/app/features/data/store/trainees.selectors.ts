import { TraineesState } from "./trainees.reducer";

export const selectTrainees = (state: { trainees: TraineesState }) => state.trainees;
