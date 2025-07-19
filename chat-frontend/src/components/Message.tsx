import { ProfileIcon } from "../Icons/ProfileIcon"

interface MessageProps {
    isSelf?: boolean,
    text: string,
    username: string,
    timestamp: string
}

export const Message = ({ text, username, timestamp, isSelf }: MessageProps) => {
    const formattedTime = new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit"});

    return (
        <div className={`flex flex-col gap-1 p-1 ${isSelf ? "items-end" : "items-start"}`}>
            {!isSelf && (
                <div className="flex items-center gap-2 text-xs text-purple-600 font-medium ml-1">
                    <ProfileIcon size='sm' />
                    <span>{username}</span>
                </div>
            )}

            <div className={`text-sm px-4 py-2 rounded-2xl shadow max-w-[75%] leading-relaxed
                ${isSelf ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white text-purple-800 border border-purple-200 rounded-bl-none'}`}>
                {text}
            </div>

            <span className={`text-[10px] mt-0.5 text-gray-400 ${isSelf ? "pr-2" : "pl-2"}`}>
                {formattedTime}
            </span>
        </div>
    )
}