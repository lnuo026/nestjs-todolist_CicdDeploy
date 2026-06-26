import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from './routes/ProtectedRoute'

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<div>Login</div>} />
        {/* 访问 / → 显示 Todolist(但要先经过登录检查) */}
        <Route path="/" element={ <ProtectedRoute> <div>Todolist</div> </ProtectedRoute> } />  
      </Routes>
      
    </BrowserRouter>
  )
}


