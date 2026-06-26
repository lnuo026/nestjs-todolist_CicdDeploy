export default function LoginPage(){
     const handleLogin = () => {
          window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`
     }

     return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
             <div className="bg-white p-10 rounded-2xl shadow-md flex flex-col items-center gap-6">
               <h1 className="text-2xl font-semibold  text-gray-800">Todolist</h1>
                    <p className="text-gray-500">login in and get started</p>
                    <button
                         onClick ={handleLogin}
                         className="flex items-center gap-3 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium"
                    >
                         <img
                              src="https://www.google.com/favicon.ico"
                              alt="Google"
                              className="w-5 h-5"
                         />
                         Login with Google
                    </button>
           </div>
          </div>
     )
}