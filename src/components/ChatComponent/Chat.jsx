// import { useState, useEffect } from "react";
// import { useAuth } from "../Context/AuthContext.jsx";
// import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
// import "./chat.css";
//
// export default function Chat() {
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState("");
//     const [connection, setConnection] = useState(null);
//     const { user } = useAuth();
//
//     useEffect(() => {
//         if (user && user.token) {
//             // Создание подключения к SignalR
//             const conn = new HubConnectionBuilder()
//                 .withUrl("http://localhost:5291/hubs/chat", {
//                     accessTokenFactory: () => user.token
//                 })
//                 .configureLogging(LogLevel.Information)
//                 .build();
//
//             // Обработка получения сообщений
//             conn.on("ReceiveMessage", (sender, message) => {
//                 setMessages((prev) => [...prev, { sender, message, timestamp: new Date() }]);
//             });
//
//             // Запуск подключения
//             conn.start()
//                 .then(() => console.log("SignalR Connected"))
//                 .catch((err) => console.error("SignalR Connection Error:", err));
//
//             setConnection(conn);
//
//             // Очистка при размонтировании
//             return () => {
//                 conn.stop();
//             };
//         }
//     }, [user]);
//
//     const sendMessage = async () => {
//         if (connection && message.trim()) {
//             try {
//                 await connection.invoke("SendMessage", user.userName, message);
//                 setMessage("");
//             } catch (err) {
//                 console.error("Error sending message:", err);
//             }
//         }
//     };
//
//     return (
//         <div className="chat-container">
//             <h2>Chat</h2>
//             <div className="messages">
//                 {messages.length > 0 ? (
//                     messages.map((msg, index) => (
//                         <div key={index} className="message">
//                             <strong>{msg.sender}</strong>: {msg.message} <br />
//                             <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
//                         </div>
//                     ))
//                 ) : (
//                     <p>No messages yet</p>
//                 )}
//             </div>
//             <div className="input-container">
//                 <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Type a message..."
//                 />
//                 <button onClick={sendMessage} disabled={!message.trim()}>
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// }
import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext.jsx";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import "./chat.css";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [connection, setConnection] = useState(null);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState("");
    const { user } = useAuth();

    // Загрузка списка друзей
    useEffect(() => {
        if (user && user.token) {
            fetch("http://localhost:5291/api/Friend/getFriends", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    setFriends(data);
                    if (data.length > 0) {
                        setSelectedFriend(data[0]); // Выбираем первого друга по умолчанию
                    }
                })
                .catch((error) => {
                    console.error("Error fetching friends:", error);
                    setFriends([]);
                });
        }
    }, [user]);

    // Настройка SignalR
    useEffect(() => {
        if (user && user.token) {
            const conn = new HubConnectionBuilder()
                .withUrl("http://localhost:5291/hubs/chat", {
                    accessTokenFactory: () => user.token,
                })
                .configureLogging(LogLevel.Information)
                .build();

            conn.on("ReceiveMessage", (sender, message) => {
                setMessages((prev) => [...prev, { sender, message, timestamp: new Date() }]);
            });

            conn.start()
                .then(() => console.log("SignalR Connected"))
                .catch((err) => console.error("SignalR Connection Error:", err));

            setConnection(conn);

            return () => {
                conn.stop();
            };
        }
    }, [user]);

    // Отправка приватного сообщения
    const sendMessage = async () => {
        if (connection && message.trim() && selectedFriend) {
            try {
                await connection.invoke("SendPrivateMessage", user.userName, selectedFriend, message);
                setMessage("");
            } catch (err) {
                console.error("Error sending message:", err);
            }
        }
    };

    return (
        <div className="chat-container">
            <h2>Chat</h2>
            <div className="friend-selector">
                <label>Select a friend: </label>
                <select
                    value={selectedFriend}
                    onChange={(e) => setSelectedFriend(e.target.value)}
                    disabled={friends.length === 0}
                >
                    {friends.length > 0 ? (
                        friends.map((friend, index) => (
                            <option key={index} value={friend}>
                                {friend}
                            </option>
                        ))
                    ) : (
                        <option value="">No friends available</option>
                    )}
                </select>
            </div>
            <div className="messages">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className="message">
                            <strong>{msg.sender}</strong>: {msg.message} <br />
                            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                        </div>
                    ))
                ) : (
                    <p>No messages yet</p>
                )}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    disabled={!selectedFriend}
                />
                <button onClick={sendMessage} disabled={!message.trim() || !selectedFriend}>
                    Send
                </button>
            </div>
        </div>
    );
}