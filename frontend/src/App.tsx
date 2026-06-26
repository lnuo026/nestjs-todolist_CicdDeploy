import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from './routes/ProtectedRoute'
import LoginPage from "./pages/LoginPage"
import { useUserStore } from "./store/userStore"
import { getMe } from "./api/auth"
import TodoPage from "./pages/TodoPage"

export default function App(){
  const { setUser, setInitialized} = useUserStore()

  useEffect (()=> {
    getMe()
      .then((user:any) =>  setUser(user))
      .catch(() => {})
      .finally(() =>  setInitialized()) 
    }, [])
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>} />
        {/* 访问 / → 显示 Todolist(但要先经过登录检查) */}
        <Route path="/" element={ <ProtectedRoute> <TodoPage /> </ProtectedRoute> } />  
      </Routes>
      
    </BrowserRouter>
  )
}


