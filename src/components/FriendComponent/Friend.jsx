
import './freind.css'
import {useEffect, useState} from "react";
import {useAuth} from "../Context/AuthContext.jsx";
export default function Freind(){
    const [friends, setFriends] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
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
    const handleAddFriend = async () => {
        if (!searchQuery.trim()) {
            setError("Please enter a username");
            return;
        }
        try {
            const response = await fetch('http://localhost:5291/api/Friend/addFriend', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                credentials: 'include',
                body: JSON.stringify(searchQuery)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setSuccess(data);
            setError(null);
            setSearchQuery("");
        } catch (error) {
            console.error('Error adding friend', error);
            setError("Failed to add friend. Please try again.");
            setSuccess(null);
        }
    };


    return (
        <>
            <div className="friend-main-container">
                <div className="friend-container">
                    <h1>Welcome to Freind component</h1>
                    <p>Your friends: </p>
                    <ul>
                        {friends.length > 0 ? (
                            friends.map((friend, index) => (
                                <li key={index}>{friend}</li>
                            ))
                        ) : (
                            <h4>No friends found</h4>
                        )}
                    </ul>
                </div>
                <div className="box">
                    <h4>Add friends</h4>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter username"
                        className="friend-input"
                    />
                    <button onClick={handleAddFriend} className="friend-button">
                        Add Friend
                    </button>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                </div>
            </div>
        </>
    )
}