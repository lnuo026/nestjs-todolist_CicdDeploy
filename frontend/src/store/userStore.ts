import { create } from 'zustand'

interface User {
     id: string
     email: string
     name: string
     picture: string
}

// 定义"这个仓库长什么样"
interface UserStore {
     user: User | null
     // 新增：是否已向后端确认过身份
     initialized: boolean
     setUser: (user: User) => void
     clearUser: () => void
     //  // 不需要参数 —  因为值永远只有一个：true
     setInitialized: () => void
}

// 真正创建仓库
// (set) => ({...}) — set 是 Zustand 给你的"修改器",调用它就能改仓库里的数据
export const useUserStore = create<UserStore>((set) => ({
     user: null,
     initialized: false,
     setUser: (user) => set({ user }),
     clearUser: () => set({ user: null }),
     setInitialized: () => set({ initialized: true }),
}))