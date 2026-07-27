import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import { useUserStore } from './store/userStore';
import { getMe } from './api/auth';

export default function App() {
  const { setUser, setInitialized } = useUserStore();

  useEffect(() => {
    getMe()
      .then((user) => setUser(user))
      .catch(() => {})
      .finally(() => setInitialized());
  }, [setUser, setInitialized]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* 空壳占位：todos 模块已下线，等待拓麻青蛙宠物养成主界面上线 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div>拓麻青蛙 施工中</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
