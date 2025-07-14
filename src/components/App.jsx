import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useMessageStore } from '../store/useMessageStore.js';
import axios from 'axios';
import lien from "./lien.js";

export default function Layout() {
    const navigate = useNavigate();
    const { setToken, setCurrentUserId } = useMessageStore();

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            navigate('/');
            return;
        }

        setToken(jwt);

        axios
            .get(lien.url+'/connection/me', {
                headers: { Authorization: `Bearer ${jwt}` },
            })
            .then((res) => {
                setCurrentUserId(res.data.id);
            })
            .catch((err) => {
                console.error("Erreur vérif JWT", err);
                localStorage.removeItem('jwt');
                navigate('/');
            });
    }, []);

    return (
        <>
            <Outlet />
        </>
    );
}
