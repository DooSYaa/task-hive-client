import {useEffect, useState} from "react";
import {useAuth} from "../Context/AuthContext.jsx";
import ChatInput from './InputChatComponent/InputChat.jsx';
import './chat.css'
import Button from "../ButtonComponent/Button.jsx";
import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";

export default function Chat(){
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [connection, setConnection] = useState(null);
    const {user} = useAuth();
    useEffect(()=>{
        fetch('http://localhost:5291/api/Friend/getFriends', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            },
        })
            .then(response => response.json())
            .then(data => {
                setFriends(data);
            })
            .catch(err=>{
                console.log('Error getting friends', err);
                setFriends([]);
            });
    },[user])

    useEffect(()=>{
        if(user && user.token)
        {
            const conn = new HubConnectionBuilder()
                .withUrl("http://localhost:5291/hubs/chat", {
                    accessTokenFactory: () => user.token,
                })
                .configureLogging(LogLevel.Information)
                .withAutomaticReconnect()
                .build();

            conn.on("ReceivePrivateMessage", (message, sender) => {
                setMessages((prev) => [...prev, { sender, message, timestamp: new Date() }]);
            });

            conn.start()
                .then(() => console.log("SignalR Connected"))
                .catch((err) => console.error("SignalR Connection Error:", err));

            setConnection(conn);
        }
    }, [user]);
    function sendMessage() {
        try{
            connection.invoke("SendPrivateMessage", user.userName, selectedFriend, message);
            setMessage("");
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    }
    return (
        <div className="main-chat-container">
            <div className="friends-container">
                    {friends.length > 0 ? (
                        friends.map((friend, index) => (
                            <div>
                                <button
                                    key={index}
                                    onClick={() => setSelectedFriend(friend)}
                                >{friend}</button>
                            </div>
                        ))
                    ) : (
                        <h3>No friends found :(</h3>
                    )}
            </div>
            <div className="chat-container">
                {selectedFriend ? (
                    <>
                        <h4>have selected friend: {selectedFriend}</h4>
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender === user.userName ? 'sent' : 'received'}`}>
                                <p>{msg.sender} {msg.message} <span>{msg.timestamp.toLocaleTimeString()}</span></p>
                            </div>
                        ))}
                        <div className="chat-input-container">
                            <ChatInput value={message} onChange={(e) => setMessage(e.target.value)} />
                            <Button onClick={sendMessage}>Send</Button>
                        </div>
                    </>
                ) : (
                    <h4>Select a friend to start chatting</h4>
                )}
            </div>
        </div>
    )

}