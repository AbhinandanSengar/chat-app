import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket,
    username: string,
    room: string
}

let allSockets: User[] = [];
let validRooms: Set<string> = new Set();
let connectionCount = 0;

console.log("Server started");

wss.on("connection", (socket) => {
    console.log("New user connected");
    connectionCount++;
    const id = `User-${connectionCount}`;
    console.log(`[+] New connection: ${id}`);

    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());

        if (parsedMessage.type === "create") {
            const roomId = parsedMessage.payload.roomId;
            validRooms.add(roomId);
            console.log(`Room ${roomId} created`)
        }


        if (parsedMessage.type === "join") {
            const { roomId, username } = parsedMessage.payload;

            if (!validRooms.has(roomId)) {
                console.log(`Join rejected. Room ${roomId} does nto exist`);
                socket.send(JSON.stringify({
                    type: "error",
                    payload: {
                        message: "Room does not exist"
                    }
                }));
                return;
            }

            //filter & remove dead sockets, if present
            allSockets = allSockets.filter(user => user.socket !== socket);

            console.log(`User joined room ${roomId}`);
            allSockets.push({
                socket,
                username,
                room: roomId
            });

            socket.send(JSON.stringify({
                type: "join-success",
                payload: {
                    roomId
                }
            }));

            const roomUsers = allSockets.filter(user => user.room === roomId);

            setTimeout(() => {
                roomUsers.forEach(user => {
                    user.socket.send(JSON.stringify({
                        type: "user-count",
                        payload: {
                            count: roomUsers.length
                        }
                    }));
                });
            }, 100)

            console.log(`Sockets: ${allSockets.length}`);
            console.log(`Valid rooms: ${Array.from(validRooms).join(", ")}`);
        }

        if (parsedMessage.type === "chat") {
            console.log("User wants to chat");
            const user = allSockets.find(x => x.socket === socket);
            if (!user) {
                return;
            }

            const currentRoom = user.room;
            allSockets.forEach(user => {
                if (user.room === currentRoom && user.socket.readyState === WebSocket.OPEN) {
                    user.socket.send(JSON.stringify({
                        type: "chat",
                        payload: {
                            username: parsedMessage.payload.username,
                            message: parsedMessage.payload.message,
                            timestamp: parsedMessage.payload.timestamp
                        }
                    }));
                }
            });
        }
    });

    socket.on("close", () => {
        const user = allSockets.find(u => u.socket === socket);
        const userRoom = user?.room;

        allSockets = allSockets.filter(user => user.socket !== socket);
        console.log("User disconnected and removed");
        console.log(`[-] Connection closed: ${id}`);

        if (userRoom) {
            const roomUsers = allSockets.filter(u => u.room === userRoom);
            roomUsers.forEach(u => {
                u.socket.send(JSON.stringify({
                    type: "user-count",
                    payload: {
                        count: roomUsers.length
                    }
                }));
            });
        }
    })
});