import { Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Homepage from "./pages/Homepage"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"
import { useThemeStore } from "./store/useThemeStore"
import { useChatStore } from "./store/useChatStore"


function App() {
  const {authUser,checkAuth,isCheckingAuth} = useAuthStore();
  const {selectedUser} = useChatStore();
  useEffect(()=>{
    checkAuth()
  },[])

  const {theme} = useThemeStore();
  if(isCheckingAuth && !authUser){
    return( 
    <div className="flex justify-center items-center h-screen">
      <Loader  className="size-10 animate-spin"/>
    </div>
    )
  }
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path = "/" element={authUser ? <Homepage/> : <Navigate to="/login" />}/>
        <Route path = "/signup" element={!authUser? <Signup/> : <Navigate to="/" />}/>
        <Route path = "/login" element={!authUser? <Login/> : <Navigate to="/" />}/>
        <Route path = "/settings" element={<Settings/>}/>
        {/* <Route path = "/video-call" element={authUser ? <VideoCallFeature/>: <Navigate to="/"/>}/> */}
        <Route path = "/profile" element={authUser ? <Profile/> : <Navigate to="/login" />}/>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
