import React, { useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Button } from "./Button"
import { Input } from "./Input"
import { CopyIcon } from "../Icons/CopyIcon";
import { ChatIcon } from "../Icons/ChatIcon";

interface ChatJoinProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setRoomCode: React.Dispatch<React.SetStateAction<string>>,
    setUsername: React.Dispatch<React.SetStateAction<string>>,
    socketRef: React.RefObject<WebSocket | null>
}

export const ChatJoin = ({ setOpen, setRoomCode, setUsername, socketRef }: ChatJoinProps) => {
    const [code, setCode] = useState("");
    const [shareModel, setShareModel] = useState(false);
    const [loadingCode, setLoadingCode] = useState(false);
    const [loadingJoin, setLoadingJoin] = useState(false);

    const nameRef = useRef<HTMLInputElement>(null);
    const codeRef = useRef<HTMLInputElement>(null);


    async function createRoom() {
        setLoadingCode(true);
        await new Promise((res) => setTimeout(res, 500));

        const options = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const randomCode = Array.from({ length: 6 }, () => options[Math.floor(Math.random() * options.length)]).join("");

        setCode(randomCode);
        setShareModel(true);
        setLoadingCode(false);

        if(socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: "create",
                payload: {
                    roomId: randomCode
                }
            }));
        } else {
            alert("WebSocket not connected. Try again.");
        }
    }

    async function joinRoom() {
        const name = nameRef.current?.value.trim();
        const code = codeRef.current?.value.trim();

        if (!name)
            return alert("please enter your name");

        setUsername(name);

        if (!code)
            return alert("please enter a room code");

        if (code.length != 6)
            return alert("Room not found or invalid");

        setLoadingJoin(true);
        await new Promise(res => setTimeout(res, 500));

        if(socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: "join",
                payload: {
                    roomId: code,
                    username: name
                }
            }));

            socketRef.current.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if(msg.type === "error") {
                    alert(msg.payload.message ||"Unable to join room");
                    setLoadingJoin(false);
                } else if(msg.type === "join-success") {
                    setOpen(true);
                    setRoomCode(code);
                    setLoadingJoin(false);
                } else {
                    console.warn("unhandled message from server: ", msg);
                }
            }
        } else {
            alert("WebSocket not connected");
            setLoadingJoin(false);
        }

    }
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div className="w-full max-w-xl flex flex-col gap-6 p-6 bg-purple-100 rounded-lg shadow-md">
                <div className='flex flex-col items-center gap-1'>
                    <div className="flex items-center gap-4">
                        <ChatIcon size="md" />
                        <div className='text-3xl'>Real-time Chat</div>
                    </div>
                    <div className='text-md'>Real-time chats, zero drama. Your STUFF stays private.</div>
                </div>

                <div>
                    <div>
                        <Button
                            variant='primary'
                            size='md'
                            onClick={createRoom}
                            fullWidth={true}
                            title={loadingCode ? (
                                <span className="flex items-center gap-1">
                                    <ClipLoader size={18} color="#fff" />
                                    Generating Code...
                                </span>) : "Create New Room"}
                        />
                    </div>
                    <div className='my-2'>
                        <Input ref={nameRef} type='text' placeholder='Enter your Name' />
                    </div>
                    <div className='my-2 flex gap-2'>
                        <Input ref={codeRef} type='text' placeholder='Enter Room Code' onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                joinRoom();
                            }
                        }} />
                        <Button
                            variant='primary'
                            size='md'
                            onClick={joinRoom}
                            title={loadingJoin ? (
                                <span className=" flex items-center gap-1">
                                    <ClipLoader size={18} color="#fff" />
                                    Joining...
                                </span>) : 'Join Room'}
                        />
                    </div>
                </div>

                {shareModel && <div className='bg-purple-300 h-full w-full rounded-lg flex flex-col items-center p-5 gap-2'>
                    <p className="text-sm font-light">Share this Room Code with your friends</p>
                    <div className='flex items-center gap-2'>
                        <p className="text-2xl font-bold">{code}</p>
                        <CopyIcon size='sm' onClick={async () => {
                            try {
                                await navigator.clipboard.writeText(code)
                                alert("copied");
                            } catch (error) {
                                alert("Copy failed");
                            }
                        }} />
                    </div>
                </div>}
            </div>
        </div>
    )
}