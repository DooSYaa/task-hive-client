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
                .build();

            conn.on("ReceiveMessage", (sender, message) => {
                setMessages((prev) => [...prev, { sender, message, timestamp: new Date() }]);
            });

            conn.start()
                .then(() => console.log("SignalR Connected"))
                .catch((err) => console.error("SignalR Connection Error:", err));

            setConnection(conn);
        }
    }, [user]);
    const sendMessage = async () => {
        await connection.invoke("SendPrivateMessage", user.userName, selectedFriend, message);
        setMessage("");
        console.error("Error sending message:");
    };
    return (
        <div className="main-chat-container">
            Main div
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
                <h4>Chat container</h4>
                {selectedFriend ? (
                    <>
                        <h4>have selected friend</h4>
                        <ChatInput />
                    </>
                ) : (
                    <>
                        <h4>No friend</h4>
                        <div>
                            <ChatInput />
                            <Button onClick={sendMessage}>Send</Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )

}