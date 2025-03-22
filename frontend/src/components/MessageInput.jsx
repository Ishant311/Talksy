import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { Image, Send, X } from 'lucide-react';

function MessageInput() {
    const [text,setText] = useState("");
    const [imagePreview,setImagePreview] = useState(null);
    const fileInputRef = useRef(null)
    const {sendMessage} = useChatStore();

    const handleImageChange = async(e)=>{
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async()=>{
            const base64URL = reader.result;
            setImagePreview(base64URL)
        }
    }
    const removeImage = ()=>{
        setImagePreview(null);
        if(fileInputRef.current){
            fileInputRef.current.value = "";
        }
    };
    const handleSendMessage = async(e)=>{
        e.preventDefault();
        if(!text.trim() && !imagePreview) return;
        try {
            await sendMessage({text:text.trim(),image:imagePreview});

            setText("");
            setImagePreview(null);
            if(fileInputRef.current){
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.log(error);
            setImagePreview(null);
            if(fileInputRef.current){
                fileInputRef.current.value = "";
            }
        }
    };
  return (
    <div className='p-4 w-full'>
        {imagePreview && (
            <div className='mb-3 flex items-center gap-2'>
                <div className="relative">
                    <img 
                    src={imagePreview} 
                    alt="Preview"
                    className='w-20 h-20 rounded-lg object-cover border border-zinc-700' 
                    />
                    <button
                    onClick={removeImage}
                    className='absolute -top-1.5 -right-1.5 size-5 bg-base-300 rounded-full flex items-center justify-center'
                    type='button'>
                        <X className="size-3"/>
                    </button>
                </div>
            </div>
        )}
        <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
            <div className='flex flex-1 gap-2'>
                <input 
                type="text"
                className='input input-bordered w-full rounded-lg input-sm sm:input-md'
                placeholder='Type a message...'
                value={text}
                onChange={(e)=>{setText(e.target.value)}} />
                <input
                type="file"
                accept='image/*'
                className='hidden'
                ref={fileInputRef}
                onChange={handleImageChange}/>
                <button
                type = "button"
                className={`flex btn btn-circle ${imagePreview ? 'text-emerald-500' : 'text-zinc-400'}`}
                onClick={()=>{fileInputRef.current?.click()}}>
                    <Image size={20}/>
                </button>
            </div>
            <button
            type='submit'
            className='btn btn-sm btn-circle p-1.5'
            disabled={!text.trim() && !imagePreview}>
                <Send size={22} />
            </button>
        </form>
    </div>
  )
}

export default MessageInput