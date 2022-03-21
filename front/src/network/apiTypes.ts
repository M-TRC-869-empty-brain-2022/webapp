export enum Progress {
    TODO,
    DOING,
    DONE,
}

export interface Task {
    id: string;
    name: string;
    progress: Progress;
}

export interface TodoList {
    id: string;
    name: string;
    description: string;
    tasks: Task[];
}