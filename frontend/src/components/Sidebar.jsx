import React, { use, useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import SideBarSkeleton from './skeletons/SideBarSkeleton';
import { ArrowLeft, Search, Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

function Sidebar() {
    const { getUsers, users, isUsersLoading, setSelectedUser, selectedUser, searchUsers, getSearchUsers } = useChatStore();
    const [searchVal, setSearchVal] = useState('');
    const [search, setSearch] = useState(false);
    useEffect(() => {
        getUsers()
    }, [getUsers]);
    const { onlineUsers } = useAuthStore();

    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const filteredUsers = showOnlineOnly ? users.filter((user) => onlineUsers.includes(user._id)) : users;
    
    const [onlineUsersCnt,setonlineUsersCnt] = useState(0);
    useEffect(()=>{
        users.map((user)=>{
            onlineUsers.includes(user._id) && setonlineUsersCnt((prevVal)=>prevVal+1);
        })
    },[])
    

    if (isUsersLoading) {
        return <SideBarSkeleton />
    }

    if (search) {
        return (
            <div className='h-screen border-r border-base-300 flex flex-col transition-all duration-200 w-full sm:w-62'>
                
                <div className='border-b border-base-300 w-full p-5 relative'>
                    <ArrowLeft onClick={() => { setSearch(false) }} className='size-6 cursor-pointer left-0 top-8 absolute' />
                    <input
                        type="text"
                        className="p-3 focus:outline-none focus:border-b"
                        value={searchVal}
                        placeholder="Type name or email"
                        onChange={(e) => { setSearchVal(e.target.value) }}
                    />
                    <Search onClick={() => {getSearchUsers(searchVal)}} className='size-6 cursor-pointer absolute top-8 right-5' />
                </div>
                <div className='overflow-y-auto w-full py-3'>
                    {searchUsers?.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => {
                                setSelectedUser(user)
                            }}
                            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser?._id === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''}`}>
                            <div className='relative mx-0'>
                                <img src={user.profilePic || "./avatar.png"} alt={user.fullName} className='size-12 object-cover rounded-full' />
                                {onlineUsers.includes(user._id) && (<div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-zinc-900'></div>)}
                            </div>


                            <div className="block text-left min-w-0">
                                <div className="font-medium truncate">{user.fullName}</div>
                                <div className="text-sm text-zinc-400">
                                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                                </div>
                            </div>
                        </button>
                    ))}

                </div>
                {searchUsers.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">No users found</div>
                )}
            </div>
        )
    }
    return (
        <aside className={`${selectedUser == null?"":"hidden"}'h-full w-full sm:w-72 border-r border-base-300 sm:flex flex-col transition-all duration-200'`}>
            <div className='border-b border-base-300 w-full p-5'>
                <div className='flex items-center justify-between gap-2 w-[90%] m-auto'>
                    <div className='flex items-center gap-2'>
                        <Users className='size-6' />
                        <span className="font-medium hidden lg:block">Contacts</span>
                    </div>
                    <Search onClick={() => { setSearch(true) }} className='size-6 cursor-pointer' />
                </div>
                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">({onlineUsersCnt} online)</span>
                </div>
            </div>
            <div className='overflow-y-auto w-full py-3'>
                {filteredUsers.map((user) => (
                    <button
                        key={user.id}
                        onClick={() => {
                            setSelectedUser(user)
                        }}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser?._id === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''}`}>
                        <div className='relative lg:mx-0'>
                            <img src={user.profilePic || "./avatar.png"} alt={user.fullName} className='size-12 object-cover rounded-full' />
                            {onlineUsers.includes(user._id) && (<div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-zinc-900'></div>)}
                        </div>


                        <div className="items-center lg:block lg:text-left min-w-0">
                            <div className="font-medium truncate">{user.fullName}</div>
                            <div className="text-sm text-zinc-400">
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}

            </div>
            {filteredUsers.length === 0 && (
                <div className="text-center text-zinc-500 py-4">No online users</div>
            )}
        </aside>
    )
}

export default Sidebar