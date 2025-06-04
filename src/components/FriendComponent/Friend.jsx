
import './freind.css'
import {useEffect, useState} from "react";
import {useAuth} from "../Context/AuthContext.jsx";
export default function Freind(){
    const [friends, setFriends] = useState([]);
    const {user} = useAuth();
    useEffect(()=>{
        if(user){
            fetch('http://localhost:5291/api/Friend/getFriends', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                credentials: 'include'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setFriends(data);
                })
                .catch(error => {
                    console.error('Error getting friends', error);
                    setFriends([]);
                })
        }
    }, [user])
    return (
        <>
            <h1>Welcome to Freind component</h1>
            <p>Your friends: </p>
            <ul>
                {friends.length > 0 ? (
                    friends.map((friend, index) => (
                        <li key={index}>{friend}</li>
                    ))
                ) : (
                    <li>No friends found</li>
                )}
            </ul>
        </>
    )
}