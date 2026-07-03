import request from './request';
import type { User } from '../store/userStore';

export const getMe = () => request.get<User>('/users/profile');
