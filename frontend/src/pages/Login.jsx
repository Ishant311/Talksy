import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [otp, setOtp] = useState("");
    const { isVerifyingOtp, isSendingOtp, otpSend, otpVerified, login, isLoggingIn, verifyOtp, sendOtp, checkOtp } = useAuthStore();
    const validateForm = () => {
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
        if (success === true) login(formData);
    }

    useEffect(() => {
        checkOtp();
    }, [])
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
                                Welcome Back!
                            </h1>
                            <p className="text-base-content/60">Sign in to Your Account</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className='space-y-6'>
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
                                    readOnly={otpSend && !otpVerified}
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
                                    readOnly={otpSend && !otpVerified}
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
                            <div className='flex flex-row gap-1'>
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
                            <button type="submit" className='btn btn-primary w-full' disabled={isLoggingIn}>
                                {isLoggingIn ? (
                                    <>
                                        <Loader2 className='size-5 animate-spin' />
                                        Loading...
                                    </>
                                ) : (<>
                                    Login
                                </>)}
                            </button>
                        )}
                    </form>
                    <div>
                        <p>
                            Don't have an account?{" "}
                            <Link to="/signup" className='link link-primary'>
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <AuthImagePattern
                title="Welcome Back!"
                subtitle="Sign in to continue to your conversations and catch up with your messages."
            />
        </div>
    )
}

export default Login