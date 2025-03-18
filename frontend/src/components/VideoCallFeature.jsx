import React, { useEffect, useRef, useState } from 'react'
import { Peer } from "simple-peer";
import { useAuthStore } from '../store/useAuthStore';

function VideoCallFeature() {
    const {socket,selectedUser} = useAuthStore();
    const [stream,setStream] = useState(null);
    const [caller,setCaller] = useState("");
    const [receivingCall, setReceivingCall] = useState(false);
    const [callerSignal, setCallerSignal] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({video:true,audio:true}).then(stream=>{
            setStream(stream);
            myVideo.current.srcObject = stream;
        })

        socket.on("incoming-call",(data)=>{
            setReceivingCall(true);
            setCaller(data.from);
            setCallerSignal(data.signal);
        })
    },[])
    const callUser = (userId) => { 
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      peer.on("signal", (signal) => {
        socket.emit("call-user", {
          userToCall: userId,
          from: socket.id,
          signal: signal,
        });
      });

      peer.on("stream",(userStream)=>{
        userVideo.current.srcObject = userStream;
      })

      socket.on("call-accepted",(signal)=>{
        setCallAccepted(true);
        peer.signal(signal);
      })

      connectionRef.current = peer;
    }

    const acceptCall = ()=>{
      setCallAccepted(true);
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      peer.on("signal", (signal) => {
        socket.emit("accept-call", { to: caller,signal:signal });
      });

      peer.on("stream",(userStream)=>{
        userVideo.current.srcObject = userStream;
      });

      peer.signal(callerSignal);
      connectionRef.current = peer;
    }
  return (
    <div>
    <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />
    {callAccepted && <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />}
    <br />
    {receivingCall && !callAccepted ? (
      <button onClick={acceptCall}>Accept Call</button>
    ) : (
      <button onClick={() => callUser(selectedUser._id)}>Call User</button>
    )}
  </div>
  )
}

export default VideoCallFeature