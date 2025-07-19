import type React from "react";
import { CopyIcon } from "../Icons/CopyIcon";
import { OutIcon } from "../Icons/OutIcon";
import { ProfileIcon } from "../Icons/ProfileIcon";

interface HeaderProps {
    userCount: number,
    roomCode: string,
    wsRef: React.RefObject<WebSocket | null>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const Header = ({ userCount, setOpen, roomCode, wsRef }: HeaderProps) => {
    function closeConnection() {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.close();
            console.log("WebSocket closed by user");
        }
        setOpen(false);
    }

    return <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white flex flex-col justify-between items-center rounded-t-2xl">
        <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
                <ProfileIcon size="md" />
                <p>User</p>
            </div>
            <OutIcon size="md" onClick={closeConnection} />
        </div>

        <div className="mt-3 px-3 py-1 flex w-full justify-between items-center gap-2 bg-white text-purple-700 rounded-full font-semibold shadow-md">
            <div className="flex items-center justify-end gap-1">
                <p>Room Code: {roomCode}</p>
                <CopyIcon size="xs" onClick={async () => {
                    try {
                        await navigator.clipboard.writeText(roomCode);
                        alert("copied");
                    } catch (error) {
                        alert("Copy failed");
                    }
                }} />
            </div>
            <div>
                <p>Users: {userCount}</p>
            </div>
        </div>
    </div>
}