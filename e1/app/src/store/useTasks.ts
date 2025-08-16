import { create } from 'zustand';
import type { Task } from '../types';

interface TasksState {
  tasks: Task[];
  addTask: (t: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

function uuid() { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = (Math.random()*16)|0, v = c === 'x' ? r : (r&0x3|0x8); return v.toString(16); }); }

export const useTasks = create<TasksState>((set, get) => ({
  tasks: [],
  addTask: (t) => {
    const now = Date.now();
    const task: Task = { id: uuid(), title: t.title, notes: t.notes, durationTag: (t as any).durationTag, createdAt: now, updatedAt: now, archived: false };
    set({ tasks: [task, ...get().tasks] });
    return task;
  },
  completeTask: (id) => set({ tasks: get().tasks.map((x) => x.id === id ? { ...x, completedAt: Date.now(), updatedAt: Date.now() } : x) }),
  deleteTask: (id) => set({ tasks: get().tasks.filter((x) => x.id !== id) }),
}));