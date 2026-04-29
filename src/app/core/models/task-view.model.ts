import { Task } from "./task.model";

export interface TaskView extends Task {
  assignedUserName: string;
}