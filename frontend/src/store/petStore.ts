import { create } from 'zustand';

// 和后端 Pet Schema 对应的字段。_id/时间戳是 Mongoose 自动加的。
export interface Pet {
  _id: string;
  name: string;
  stage: 'egg' | 'baby' | 'adult' | 'elder';
  hunger: number;
  mood: number;
  stamina: number;
  isSick: boolean;
  level: number;
  exp: number;
}

export interface PetStore {
  pet: Pet | null;
  setPet: (pet: Pet) => void;
}

export const usePetStore = create<PetStore>((set) => ({
  pet: null,
  setPet: (pet) => set({ pet }),
}));
