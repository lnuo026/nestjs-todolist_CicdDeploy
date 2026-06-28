import {  useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../api/todos";

interface Todo {
     _id: string
     title: string
     done: boolean
     priority: 'low' | 'medium' | 'high'
}

const priorityStyle = {
     low: 'bg-green-100 text-green-700',
     medium: 'bg-yellow-100 text-yellow-700',
     high: 'bg-red-100 text-red-700',
}

export default function TodoPage() {
// 从 Zustand 拿用户信息（头像、名字）
  const user = useUserStore((state) => state.user)
  const clearUser = useUserStore((state) =>
  state.clearUser) // 退出时清空 store
  // Todo 列表，初始空数组
  const [todos, setTodos] = useState<Todo[]>([])
  // 输入框内容
  const [input, setInput] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')


//页面加载时拉取列表
//[] 依赖数组为空,只在组件第一次挂载时执行一次，拿到数据后存进 todos
useEffect(() => {
     getTodos().then((data: any) => setTodos(data)) }, [])


// 四个操作函数
//   handleAdd()    // 读 input → POST /todos → 把新 todo 追加到 todos 末尾 → 清空输入框
//   handleToggle() // 点 checkbox → PATCH /todos/:id {done: !todo.done } → 更新对应那条
//   handleDelete() // 点 ✕ → DELETE /todos/:id → 从数组里过滤掉那条
//   handleLogout() // 清空 store → 跳后端 /auth/logout（清 cookie）→ 后端 redirect 回 /login
//   这四个函数都是：先调 API，等后端确认成功后，再用 setTodos 更新本地状态。不是先改本地再发请求，避免后端失败但前端已经改了的不一致。

const handleAdd = async () => {
     if(!input.trim()) 
          return 
     const todo = await createTodo({ title: input.trim(), priority })
     setTodos ((prev) => [...prev, todo as any])
     setInput('')
}

const handleToggle = async (todo: Todo) => {
     const updated = await updateTodo(todo._id, { done: !todo.done})
     setTodos((prev) => prev.map((t) => (t._id === todo._id ? ( updated as any) : t)))
}

const handleDelete = async (id: string) => {
     await deleteTodo(id)
     setTodos((prev) => prev.filter((t) => t._id !== id))
}

const handleLogout = async () => {
     clearUser()
     window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/logout`
}

return (
          <div className="min-h-screen bg-gray-50">
               <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">Todolist</h1>
                    <div className="flex items-center gap-3">
                         {user?.picture && <img src={user.picture} className="w-8 h-8 rounded-full" />}
                              <span className="text-sm text-gray-600">
                                   {user?.name}
                              </span>
                         <button onClick={handleLogout}  className="text-sm text-gray-500 hover:text-red-500 transition"> Logout</button>
                    </div>
               </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex gap-2 mb-6">
               <input
                 type="text"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                 placeholder="Add a new todo..."
                 className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
               >
               <select
                 value={priority}
                 onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                 className="flex-1 border border-gray-300 rounded-lgpx-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                 />
               
                 <option value="low">Low</option>
                 <option value="medium">Medium</option>
                 <option value="high">High</option>
               <select/>

               <button onClick ={handleAdd}  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition">
                    Add Todo
               </button>
          </div>
          
          <ul className = "space-y-2">
               {todos.map((todo) => (
                    <li key ={todo._id} className="bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
                         <input
                           type="checkbox"
                           checked={todo.done}
                           onChange={() => handleToggle(todo)}
                           className="form-checkbox h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                         />
                         <span className={`flex-1 text-sm ${todo.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                           {todo.title}
                         </span>
                         <span className={`text-xs px-2 py-0.5 rounded-full ${priorityStyle[todo.priority]}`}>
                              {todo.priority}
                         </span>
                         <button onClick ={ ()=> handleDelete(todo._id)}  className="text-gray-400  hover:text-red-500 transition text-sm">
                              ×
                         </button>
                    </li>
               ))}
               {todos.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-8">No todos yet.</p>)}
          </ul>
     </main>
</div>
)
}