import React, { useState } from 'react'
import { Camera, MailIcon, User } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore';
function Profile() {
  const { authUser, updateProfile, isUpdatingProfile} = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageUpload = async(e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async()=>{
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      console.log(base64Image);
      await updateProfile({profilePic:base64Image});
    }
  }
  return (
    <div className='flex flex-col items-center gap-4 pt-20 h-screen'>

      <div className='flex flex-col items-center justify-center p-2 sm:p-4 gap-3 bg-base-300 w-80 sm:w-125 rounded-lg m-auto'>
        <div className='flex flex-col items-center gap-3'>
          <div className='text-3xl'>Profile</div>
          <div className='text-lg'>Your Profile Information</div>
        </div>
        <div className='flex flex-col items-center gap-3'>
          <div className='relative'>
            <img src={selectedImage || authUser?.profilePic || "/avatar.png"} alt="profile" className='size-32 rounded-full object-cover border-4' />
            <label htmlFor="avatar-upload" className={`absolute right-0 bottom-0 size-6 bg-base-content hover:scale-105 rounded-full p-0.5 transition-all cursor-pointer duration-200 ${isUpdatingProfile?"animate:pulse pointer-events-none":""}`}>
              <Camera className='size-5 text-base-200' />
              <input
              type='file'
              id='avatar-upload'
              className='hidden'
              accept='image/*'
              onChange={handleImageUpload}
              disabled = {isUpdatingProfile}
              />
            </label>
          </div>
          <div className='hidden sm:inline'>{isUpdatingProfile?"Uploading....":"Click The camera Icon to Update the Photo"}</div>
        </div>
        <div className='flex flex-col items-center gap-3 w-[100%]'>
          <div className='w-[100%] flex flex-col gap-2'>
            <label className='label'>
              <User className='w-5 h-5 text-base-content/40' />
              <span className='label-text font-medium'>Full Name</span>
            </label>
            <input
              type="text"
              className='input w-full focus:border-none focus:outline-none border-0 ring-0'
              value={authUser?.fullName}
              readOnly={true}
            />
          </div>
          <div className='w-[100%] flex flex-col gap-2'>
            <label className='label'>
              <MailIcon className='w-5 h-5 text-base-content/40' />
              <span className='label-text font-medium'>Email</span>
            </label>
            <input
              type="email"
              className='input w-full focus:border-none focus:outline-none border-none ring-0'
              value={authUser?.email}
              readOnly={true}
            />
          </div>
        </div>
      </div>
      <div className='flex flex-col items-start gap-3 bg-base-300 w-80 sm:w-125 rounded-lg p-4'>
        <div>Account Information</div>
        <div className='flex justify-between items-center w-full'>
          <div>Member Since</div>
          <div>{authUser?.createdAt.split("T")[0]}</div>
        </div>
        <div className='flex justify-between items-center w-full'>
          <div>Account Status</div>
          <div className='text-green-500'> • Active</div>
        </div>
      </div>
    </div>
  )
}

export default Profile