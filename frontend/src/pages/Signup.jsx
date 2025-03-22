import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from "../components/AuthImagePattern.jsx"
import toast from 'react-hot-toast';

function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    })
    const [otp,setOtp] = useState("");
    const {isSigningUp,isVerifyingOtp,isSendingOtp,otpSend,otpVerified,login,isLoggingIn,verifyOtp,sendOtp,checkOtp,signup} = useAuthStore();

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            return toast.error("full Name is required")
        }
        if (!formData.email.trim()) {
            return toast.error("Email is required")
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
        if (!formData.password.trim()) {
            return toast.error("Password is required")
        }
        if (formData.password.length < 6) {
            return toast.error("Password must be atleast of length 6");
        }
        return true;
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const success = validateForm();
        if (success === true) signup(formData);
    }
    useEffect(()=>{
        checkOtp();
    },[])
    return (
        <div className='min-h-screen grid lg:grid-cols-2'>
            {/* left side */}
            <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
                <div className='w-full max-w-md space-y-8'>
                    {/* LOGO */}
                    <div className='text-center mb-8'>
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <MessageSquare className='size-6 text-primary' />
                            </div>
                            <h1 className='text-2xl font-bold mt-2'>
                                Create Account
                            </h1>
                            <p className="text-base-content/60">Get Started with Your free account</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='form-control'>
                            <label className='label'>
                                <span className='label-text font-medium'>Full Name</span>
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-200'>
                                    <User className='w-5 h-5 text-base-content/40' />
                                </div>
                                <input
                                    type="text"
                                    className='input input-bordered w-full pl-10'
                                    placeholder='John Doe'
                                    value={formData.fullName}
                                    onChange={(e) => {
                                        setFormData({ ...formData, fullName: e.target.value })
                                    }}
                                />
                            </div>
                        </div>
                        <div className='form-control'>
                            <label className='label'>
                                <span className='label-text font-medium'>Email</span>
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-200'>
                                    <Mail className='w-5 h-5 text-base-content/40' />
                                </div>
                                <input
                                    type="email"
                                    className='input input-bordered w-full pl-10'
                                    placeholder='you@example.com'
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value })
                                    }}
                                />
                            </div>
                        </div>
                        <div className='form-control'>
                            <label className='label'>
                                <span className='label-text font-medium'>Password</span>
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-200'>
                                    <Lock className='w-5 h-5 text-base-content/40' />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className='input input-bordered w-full pl-10'
                                    placeholder='••••••••••'
                                    value={formData.password}
                                    onChange={(e) => {
                                        setFormData({ ...formData, password: e.target.value })
                                    }}
                                />

                                <div className='absolute right-4 inset-y-0 pl-3 flex items-center cursor-pointer z-200' onClick={() => { setShowPassword((prev) => !prev) }}>
                                    {showPassword ?
                                        <Eye
                                            className="size-5 text-base-content/40"
                                        />
                                        :
                                        <EyeOff
                                            className="size-5 text-base-content/40"
                                        />}
                                </div>
                            </div>
                        </div>
                        {otpVerified === false && otpSend === false && (
                            <button onClick={(e) => {
                                e.preventDefault();
                                sendOtp(formData.email)
                            }} className='btn btn-primary w-full' disabled={isSendingOtp}>
                                {isSendingOtp ? (
                                    <>
                                        <Loader2 className='size-5 animate-spin' />
                                        Loading...
                                    </>
                                ) : (<>
                                    Send OTP
                                </>)}
                            </button>
                        )}
                        {otpVerified === false && otpSend === true && (
                            <div className='flex flex-col space-y-4 gap-3'>
                                <div>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => {
                                            setOtp(e.target.value)
                                        }}
                                        maxLength={6}
                                        placeholder='Enter OTP'
                                        className='input input-bordered w-full'
                                    />
                                </div>
                                <div>
                                    <button onClick={() => { verifyOtp(otp, formData.email) }} className='btn btn-primary w-full' disabled={isVerifyingOtp}>
                                        {isVerifyingOtp ? (
                                            <>
                                                <Loader2 className='size-5 animate-spin' />
                                                Loading...
                                            </>
                                        ) : (<>
                                            Verify Otp
                                        </>)}
                                    </button>
                                </div>
                            </div>
                        )}
                        {otpVerified === true && (
                            <button type="submit" className='btn btn-primary w-full' disabled={isSigningUp}>
                                {isSigningUp ? (
                                    <>
                                        <Loader2 className='size-5 animate-spin' />
                                        Loading...
                                    </>
                                ) : (<>
                                    Sign up
                                </>)}
                            </button>
                        )}
                    </form>
                    <div>
                        <p>
                            Already Have an account?{" "}
                            <Link to="/login" className='link link-primary'>
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            {/* Right Side */}
            <AuthImagePattern
                title="Join Our Community"
                subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
            />
        </div>
    )
}

export default Signup