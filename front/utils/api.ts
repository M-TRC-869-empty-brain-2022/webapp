import axios, { AxiosInstance } from 'axios';

// todo replace with correct var from env.
const backendUrl = 'http://localhost:8080';

type AuthResponse = {
  access_token: string;
};

type AuthRequest = {
  username: string;
  password: string;
};

type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

type TodolistType = {
  id: string;
  description: string;
  name: string;
  shared: boolean;
  user: { username: string };
  tasks: Array<TaskType>;
};

type CreateTodolistRequest = Pick<TodolistType, 'name' | 'description'>;
type UpdateTodolistRequest = Pick<TodolistType, 'name' | 'description' | 'shared'>;

type TaskType = {
  id: string;
  name: string;
  progress: 'TODO' | 'IN_PROGRESS' | 'DONE';
};

type CreateTaskRequest = Pick<TaskType, 'name'>;
type UpdateTaskRequest = Pick<TaskType, 'name' | 'progress'>;

class Api {
  instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: backendUrl,
      timeout: 3000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.setHeaderToken(localStorage.getItem('token'));
  }

  setHeaderToken(token: string | null) {
    this.instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('token', token);
  }

  unsetHeaderToken() {
    delete this.instance.defaults.headers.common.Authorization;
    localStorage.removeItem('token');
  }

  /* **************
    API Methods
    ************** */

  //
  // Auth
  //

  login = (data: AuthRequest): Promise<void> =>
    this.instance
      .post<AuthResponse>('/auth/login', data)
      .then((res) => res.data)
      .then(({ access_token }) => this.setHeaderToken(access_token));

  logout = (): void => this.unsetHeaderToken();

  register = (data: AuthRequest): Promise<void> =>
    this.instance
      .post<AuthResponse>('/auth/register', data)
      .then((res) => res.data)
      .then(({ access_token }) => this.setHeaderToken(access_token));

  changePassword = (data: ChangePasswordRequest): Promise<void> =>
    this.instance.post('/user/reset-pwd', data);

  //
  // Todolist
  //

  createTodolist = (data: CreateTodolistRequest): Promise<TodolistType> =>
    this.instance.post<TodolistType>('/todo', data).then((res) => res.data);

  getUserTodolists = (): Promise<Array<TodolistType>> =>
    this.instance.get<Array<TodolistType>>('/todo').then((res) => res.data);

  getTodolistById = (todolistId: string): Promise<TodolistType> =>
    this.instance.get<TodolistType>(`/todo/${todolistId}`).then((res) => res.data);

  updateTodolist = (todolistId: string, data: UpdateTodolistRequest): Promise<TodolistType> =>
    this.instance.put<TodolistType>(`/todo/${todolistId}`, data).then((res) => res.data);

  deleteTodolist = (todolistId: string): Promise<void> =>
    this.instance.delete<void>(`/todo/${todolistId}`).then((res) => res.data);

  //
  // Task
  //

  createTask = (todolistId: string, data: CreateTaskRequest): Promise<TaskType> =>
    this.instance.post<TaskType>(`/task/${todolistId}`, data).then((res) => res.data);

  updatetask = (taskId: string, data: UpdateTaskRequest): Promise<TaskType> =>
    this.instance.put<TaskType>(`/task/${taskId}`, data).then((res) => res.data);

  deleteTask = (taskId: string): Promise<void> =>
    this.instance.delete<void>(`/task/${taskId}`).then((res) => res.data);
}

export default new Api();
