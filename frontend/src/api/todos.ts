import request from './request';

export interface Todo {
  _id: string;
  title: string;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
}

export const getTodos = () => request.get<Todo[]>('/todos');

export const createTodo = (data: { title: string; description?: string; priority?: string }) =>
  request.post<Todo>('/todos', data);

export const updateTodo = (id: string, data: { done?: boolean; title?: string }) =>
  request.patch<Todo>(`/todos/${id}`, data);

export const deleteTodo = (id: string) => request.delete(`/todos/${id}`);
