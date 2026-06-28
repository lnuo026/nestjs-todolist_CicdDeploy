import request from "./request";

export const getTodos = () => request.get('/todos')

export const createTodo = (data: {
      title: string;
      description?: string;
      priority?: string;
     }) => request.post('/todos', data)

export const updateTodo = (id: string, data: { done?: boolean; title?: string }) =>
     request.patch(`/todos/${id}`, data)

export const deleteTodo = (id: string) => request.delete(`/todos/${id}`)