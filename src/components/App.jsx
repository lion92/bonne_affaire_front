import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../css/layout.css';

export default function Layout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        navigate('/');
    };

    return (
        <>
            <Outlet />
        </>
    );
}
