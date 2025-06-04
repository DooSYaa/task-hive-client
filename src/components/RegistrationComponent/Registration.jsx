import './registration.module.css'
import styles from "../RegistrationComponent/registration.module.css";
import Button from "../ButtonComponent/Button.jsx";
import {useState} from "react";
export default function Registration(){
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(e){
        e.preventDefault()
        fetch('http://localhost:5291/api/Account/registration', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "userName": userName,
                "email": email,
                "password": password,
            })
        })
            .then(res => res.json())
            .then(data => {console.log(data)})
            .catch(err => console.log(err));
    }
    return (
        <div className={styles.registrationContainer}>
            <form onSubmit={handleSubmit}>
                <label className={styles.formLabel} htmlFor="username">User name</label> <br/>
                <input className={styles.formInput}
                       id="username"
                       type="text"
                       value={userName}
                       onChange={(e) => setUserName(e.target.value)}
                /> <br/>
                <label className={styles.formLabel} htmlFor="email">Email</label> <br/>
                <input className={styles.formInput}
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