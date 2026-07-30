import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import { useUserStore } from './store/userStore';
import { getMe } from './api/auth';
import PetDashboardPage from './pages/PetDashboardPage';
import GamePage from './pages/GamePage';

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
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PetDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <GamePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
