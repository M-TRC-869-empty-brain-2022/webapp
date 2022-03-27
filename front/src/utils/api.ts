import axios, { AxiosInstance } from 'axios';

// todo replace with correct var from env.
const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

enum Role {
  USER = "USER",
  ADMIN = "ADMIN"
};

export type User = {
  createdAt: Date;
  id: string;
  password: string;
  role: Role;
  updatedAt: Date;
  username: string;
}

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

export type TodolistType = {
  id: string;
  description: string;
  name: string;
  shared: boolean;
  user: { username: string };
  tasks: Array<TaskType>;
};

type CreateTodolistRequest = Pick<TodolistType, 'name' | 'description'>;
type UpdateTodolistRequest = Pick<TodolistType, 'name' | 'description' | 'shared'>;

export type Progress = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type TaskType = {
  id: string;
  name: string;
  progress: Progress;
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
    localStorage.setItem('token', token || '');
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

  profile = async (): Promise<User> =>
      (await this.instance.get('/user/profile-tmp-not-secure')).data;

  //
  // TodoList
  //

  createTodoList = (data: CreateTodolistRequest): Promise<TodolistType> =>
    this.instance.post<TodolistType>('/todo', data).then((res) => res.data);

  getUserTodoLists = (): Promise<Array<TodolistType>> =>
    this.instance.get<Array<TodolistType>>('/todo').then((res) => res.data);

  getTodoListById = (todolistId: string): Promise<TodolistType> =>
    this.instance.get<TodolistType>(`/todo/${todolistId}`).then((res) => res.data);

  updateTodoList = (todolistId: string, data: UpdateTodolistRequest): Promise<TodolistType> =>
    this.instance.put<TodolistType>(`/todo/${todolistId}`, data).then((res) => res.data);

  deleteTodoList = (todolistId: string): Promise<void> =>
    this.instance.delete<void>(`/todo/${todolistId}`).then((res) => res.data);

  //
  // Task
  //

  createTask = (todolistId: string, data: CreateTaskRequest): Promise<TaskType> =>
    this.instance.post<TaskType>(`/task/${todolistId}`, data).then((res) => res.data);

  updateTask = (taskId: string, data: UpdateTaskRequest): Promise<TaskType> =>
    this.instance.put<TaskType>(`/task/${taskId}`, data).then((res) => res.data);

  deleteTask = (taskId: string): Promise<void> =>
    this.instance.delete<void>(`/task/${taskId}`).then((res) => res.data);
}

export default new Api();
