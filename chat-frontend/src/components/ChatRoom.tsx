import React, { useState, useEffect, useRef } from "react"
import { Input } from "./Input"
import { Message } from "./Message"
import { Header } from "./Header"
import { SendIcon } from "../Icons/SendIcon"

interface ChatRoomProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    socketRef: React.RefObject<WebSocket | null>,
    roomCode: string,
    username: string
}

interface ChatMessage {
    text: string,
    username: string,
    timestamp: string
}

export const ChatRoom = ({ setOpen, socketRef, roomCode, username }: ChatRoomProps) => {
    const [userCount, setUserCount] = useState<number>(1);
    const [messages, setMessages] = useState<ChatMessage[]>([{
        text: "Welcome to the ChatRoom!",
        username: "System",
        timestamp: new Date().toISOString()
    }]);

    const chatRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTo({
                top: chatRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();

        const socket = socketRef.current;
        if (!socket)
            return;

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            console.log("Received message:", msg);

            // if (typeof msg === "string") {
            //     //@ts-ignore
            //     setMessages((prev) => [...prev, msg]);
            //     return;
            // }

            if (msg.type === "user-count") {
                setUserCount(msg.payload.count);
            } else if (msg.type === "chat") {
                const { message, username, timestamp } = msg.payload;
                setMessages((prev) => [...prev, {
                    text: message,
                    username,
                    timestamp
                }]);
            } else {
                console.warn("Unhandled message:", msg);
            }
        };

        return () => {
            socket.onmessage = null;
        };
    }, []);

    function sendMessage() {
        const message = inputRef.current?.value;
        if (!message?.trim()) {
            alert("Please enter the message");
            inputRef.current?.focus();
            return;
        }

        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            alert("WebSocket connection is not open. Please wait.");
            return;
        }

        socketRef.current.send(JSON.stringify({
            type: "chat",
            payload: {
                message: message,
                timestamp: new Date().toISOString(),
                username: username
            }
        }));

        if (inputRef.current) {
            inputRef.current.value = "";
            inputRef.current?.focus();
        }
    }

    return (
        <div className="h-screen w-screen bg-[#f2e8ff] text-gray-800 flex justify-center items-center gap-5">
            <div className="w-full max-w-md h-2/3 flex flex-col bg-white rounded-2xl shadow-xl border border-purple-200">
                <Header userCount={userCount} roomCode={roomCode} setOpen={setOpen} wsRef={socketRef} />

                <div ref={chatRef} className=' bg-[#f5eaff] opacity-85 overflow-y-auto px-3 py-2 flex-1 space-y-2'>
                    {messages.map((message, idx) => (<Message key={idx} text={message.text} username={message.username} timestamp={message.timestamp} />))}
                </div>

                <div className="w-full bg-purple-50 flex items-center px-4 py-3 gap-2 border-t border-purple-200 rounded-b-2xl">
                    <Input ref={inputRef} type="text" placeholder="Message..." onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage();
                        }
                    }} />
                    <SendIcon size="md" onClick={sendMessage} />
                </div>
            </div>
        </div>
    )
}