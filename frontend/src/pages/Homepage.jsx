import React from 'react'
import { useChatStore } from '../store/useChatStore'
import Sidebar from '../components/Sidebar';
import NoChatSelected from '../components/NoChatSelected';
import ChatSelected from '../components/ChatSelected';

function Homepage() {
  const {selectedUser} = useChatStore();
  return (
    <div className='h-screen bg-base-200'>
      <div className='flex items-center justify-center pt-20 px-4'>
        <div className='bg-base-100 rounded-lg p-8 shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]'>
          <div className='flex h-full rounded-lg overflow-hidden'>
            {!selectedUser ? (<Sidebar/>):(<></>)}
            {!selectedUser ? (<NoChatSelected/>):(<ChatSelected />)}
          </div>
        </div>

      </div>

    </div>
  )
}

export default Homepage