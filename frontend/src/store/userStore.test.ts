import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from './userStore';

describe('userStore', () => {
  beforeEach(() => {
    useUserStore.setState({ user: null, initialized: false });
  });

  it('initial state should be null, initialized false', () => {
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.initialized).toBe(false);
  });

  it('setUser should save user to store', () => {
    const fakeUser = { id: '1', email: 'a@test.com', name: 'Alice', picture: '' };
    useUserStore.getState().setUser(fakeUser);

    expect(useUserStore.getState().user).toEqual(fakeUser);
  });

  it('clearUser should set user to null', () => {
    useUserStore.getState().setUser({ id: '1', email: 'a@test.com', name: 'Alice', picture: '' });
    useUserStore.getState().clearUser();

    expect(useUserStore.getState().user).toBeNull();
  });

  it('setInitialized should set initialized to true', () => {
    useUserStore.getState().setInitialized();
    expect(useUserStore.getState().initialized).toBe(true);
  });
});
