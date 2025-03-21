import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast";
import { io } from "socket.io-client"

const baseUrl = import.meta.env.MODE === "development" ? "http://localhost:8080" : "/";
export const useAuthStore = create((set,get)=>({
    isSendingOtp:false,
    otpSend : false,
    isVerifyingOtp:false,
    otpVerified:false,
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    onlineUsers:[],
    isCheckingAuth: true,
    socket:null,
    checkAuth:async()=>{
        try {
            const res = await axiosInstance.get(`/auth/check`);
            set({authUser:res.data})
            get().connectSocket();
        } catch (error) {
            set({authUser:null})
        } finally{
            set({isCheckingAuth:false});
        }
    },
    checkOtp:async()=>{
        try {
            const res = await axiosInstance.get("/auth/check-otp");
            set({otpVerified:true});
        } catch (error) {
            console.log(error)
        }
    },
    sendOtp : async (email)=>{
        set({isSendingOtp:true});
        try {
            const res = await axiosInstance.post("/auth/send-otp",{email});
            toast.success(res.data.message);
            set({otpSend:true});
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isSendingOtp:false});
        }
    },
    verifyOtp : async(otp,email)=>{
        set({isVerifyingOtp:true});
        try {
            const res = await axiosInstance.post("/auth/verify-otp",{userTypedOtp:otp,email});
            toast.success(res.data.message);
            set({otpVerified:true});
        } catch (error) {
            toast.error(error.response.data.message)
        } finally{
            set({isVerifyingOtp:false});
        }
    },
    signup:async (data)=>{
        set({ isSigningUp:true });
        try {
            const res = await axiosInstance.post("/auth/signup",data)
            set({ authUser: res.data});
            get().connectSocket();
            toast.success("Account created Successfully");
        } catch (error) {
            toast.error(error.response.data.message)
        } finally{
            set({isSigningUp:false})
        }
    },
    login:async (data)=>{
        set({ isLoggingIn:true });
        try {
            const res = await axiosInstance.post("/auth/login",data)
            console.log(res.data)
            set({ authUser: res.data});
            get().connectSocket();
            toast.success("Logged in Successfully");
        } catch (error) {
            toast.error(error.response.data.message)
        } finally{
            set({isLoggingIn:false})
        }
    },
    logout:async()=>{
        try {
            const res = await axiosInstance.post("/auth/logout");
            set({authUser:null});
            get().disconnectSocket();
            toast.success(res.data.message);
        } catch (error) {
            console.log(error)
        }
    },
    updateProfile:async(data)=>{
        set({ isUpdatingProfile:true });
        try {
            const res = await axiosInstance.put("auth/update-profile",data);
            console.log(res.data);
            set({authUser:res.data});
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log(error)
        } finally{
            set({isUpdatingProfile:false});
        }
    },
    connectSocket:()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected ) {
            console.log("hello");
            return
        };
        const socket = io(baseUrl,{
            query:{
                userId:authUser._id
            }
        });
        socket.connect();
        set({socket:socket});

        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds});
        })
    },
    disconnectSocket:()=>{
        if(get().socket?.connected){
            get().socket.disconnect();
            set({socket:null});
        }
    }
}))