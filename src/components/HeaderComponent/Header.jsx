import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../Context/AuthContext.jsx";
import Login from '../LoginComponent/Login.jsx';
import Registration from '../RegistrationComponent/Registration.jsx';
import './header.css';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <header className="header-component">
            <nav className="header-main">
                <div className="header-logo">
                    <Link className="nav-link" to="/">
                        <h2>TaskHive</h2>
                    </Link>
                </div>
                <div className="nav-menu">
                    <Link className="nav-link" to="/">Home</Link>
                    <Link className="nav-link" to="#">About</Link>
                    <Link className="nav-link" to="#">Subscribe</Link>
                    <Link className="nav-link" to="/friends">Friends</Link>
                    <Link className="nav-link" to="/chat">Chat</Link>
                </div>
            </nav>
            <nav className="header-account">
                {user ? (
                    <>
                        <Link className="nav-link" to="/user">{user.userName}</Link>
                        <Link className="nav-link" to="#" onClick={handleLogout}>Logout</Link>
                    </>
                ) : (
                    <>
                        <Link className="nav-link" to="/login">Login</Link>
                        <Link className="nav-link" to="/registration">Registration</Link>
                    </>
                )}
            </nav>
        </header>
    );
}
// export default function Header(){
//     const { user, logout } = useAuth();
//     const navigate = useNavigate();
//
//     function handleLogout(){
//         logout();
//         navigate('/');
//     }
//
//     return (
//         <header className="header-component">
//             {user ? (
//                 <nav className="header-main">
//                     <div className="header-logo">
//                         <Link className="nav-link" to="/"><h2>TaskHive</h2></Link>
//                     </div>
//                     <div className="nav-menu">
//                         <Link className="nav-link" to="/">Home</Link>
//                         <Link className="nav-link" to="#">About</Link>
//                         <Link className="nav-link" to="#">Subscribe</Link>
//                         <Link className="nav-link" to="#">Friends</Link>
//                     </div>
//                 <nav className="header-account">
//                     <Link className="nav-link" to='/user'>{user.userName}</Link>
//                     <Link className="nav-link" onClick={handleLogout}>Logout</Link>
//                 </nav>
//             ) : (
//                     <nav className="header-main">
//                         <div className="header-logo">
//                             <Link className="nav-link" to="/"><h2>TaskHive</h2></Link>
//                         </div>
//                         <div className="nav-menu">
//                             <Link className="nav-link" to="/">Home</Link>
//                             <Link className="nav-link" to="#">About</Link>
//                             <Link className="nav-link" to="#">Subscribe</Link>
//                         </div>
//                     </nav>
//                 <nav className="header-account">
//                     <Link className="nav-link" to='/login'>Login</Link>
//                     <Link className="nav-link" to='/registration'>Registration</Link>
//                 </nav>
//             )}
//         </header>
//             )