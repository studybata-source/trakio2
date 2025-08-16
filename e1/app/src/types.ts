export type DurationTag = `${number} h` | `${number} m`;

export interface Task {
  id: string;
  title: string;
  notes?: string;
  durationTag?: DurationTag;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  archived?: boolean;
  providerId?: 'googleTasks' | 'todoist';
  providerTaskId?: string;
}