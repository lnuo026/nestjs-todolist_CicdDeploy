import { Navigate } from 'react-router-dom'
import { useUserStore} from '../store/userStore'


export default function ProtectedRoute ({children}:{children: React.ReactNode}) {
     const user = useUserStore((state) => state.user)
     const initialized = useUserStore((state) => state.initialized)

     if(!initialized) return null
     if(!user) return <Navigate to= "/login" replace />
     return <>{children}</>
}