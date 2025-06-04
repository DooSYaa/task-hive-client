import Button from '../ButtonComponent/Button.jsx'
import styles from './login.module.css'
import {useState} from "react";
import {useAuth} from "../Context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    function handleSubmit(e){
        e.preventDefault();
        fetch('http://localhost:5291/api/Account/login', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "email": email,
                "password": password,
            })
        })
            .then(response => response.json())
            .then(data => {
                const userName = data.userName;
                if(userName) {
                    login(userName, data.token);
                    navigate('/');
                } else {
                    throw new Error('Username not found in this response')
                }
            })
            .catch(err => console.log(err));
    }
    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleSubmit}>
                <label className={styles.formLabel} htmlFor="email">Email</label> <br/>
                <input
                    className={styles.formInput}
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                /> <br/>
                <label className={styles.formLabel} htmlFor="password">Password</label> <br/>
                <input
                    className={styles.formInput}
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /> <br/>
                <Button />
            </form>
        </div>
    )
}