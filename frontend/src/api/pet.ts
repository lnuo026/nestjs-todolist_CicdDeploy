import request from './request';
import type { Pet } from '../store/petStore';

export const getMyPet = () => request.get<Pet>('/pets/me');

export const feedPet = () => request.post<Pet>('/pets/me/feed');
