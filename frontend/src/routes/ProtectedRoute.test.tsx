import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useUserStore } from '../store/userStore';

// ProtectedRoute 内部用了 <Navigate to="/login"/>，这个组件必须活在
// react-router 的上下文里才能工作，直接 render 会报错。
// MemoryRouter 是专门给测试用的路由容器：不依赖真实浏览器地址栏，
// 用一个内存里的假地址列表模拟"当前在哪个路由"

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useUserStore.setState({ user: null, initialized: false });
  });

  it('should render nothing when not initialized', () => {
    renderProtectedRoute();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('should navigate to /login when not authenticated', () => {
    useUserStore.setState({ user: null, initialized: true });
    renderProtectedRoute();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should display render content when authenticated', () => {
    useUserStore.setState({
      initialized: true,
      user: { id: '1', email: 'user@test.com', name: 'Alice', picture: '' },
    });
    renderProtectedRoute();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
