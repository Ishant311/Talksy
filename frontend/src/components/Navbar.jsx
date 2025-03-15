import React, { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { LogOut, MessageSquare, Settings, User } from 'lucide-react';

function Navbar() {
  const {authUser,logout} = useAuthStore();
  return (
    <>
    <header
    className='border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80 flex' 
    >
      <div className='container mx-auto px-4 h-16'>
        <div className='flex items-center justify-between h-full w-[90%] mx-auto'> 
          <div className="flex items-center gap-8">
            <Link to="/" className='flex items-center gap-2.5 hover:opacity-80 transition-all'>
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center cursor-pointer">
                  <MessageSquare className='w-5 h-5'/>
                </div>
                <h1 className='text-lg font-bold'>Talksy</h1>
            </Link>
          </div>
          <div className='flex items-center gap-2'>
            <div>
              <Link 
              to="/settings"
              className='btn btn-sm gap-2 transition-colors cursor-pointer'
              >
                <Settings className='w-4 h-4'/>
                <span className='hidden sm:inline'>Settings</span>
              </Link>
            </div>
              {authUser && ( 
                <>
                <Link to="/profile"  className='btn btn-sm gap-2 cursor-pointer'>
                  <User className='w-4 h-4'/>
                  <span className='hidden sm:inline'>Profile</span>
                </Link>
                <button className='flex gap-2 items-center cursor-pointer' onClick={logout}>
                  <LogOut className='size-5'/>
                  <span className='hidden sm:inline'>Logout</span>
                </button>
                </>
              )}

          </div>
        </div>
      </div>
    </header>
    </>
  )
}

export default Navbar