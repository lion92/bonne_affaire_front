import { useEffect, useRef, useState, useCallback } from 'react';
import { useMessageStore } from '../store/useMessageStore.js';
import axios from 'axios';

function MessageBox() {
    const [text, setText] = useState('');
    const { messages, currentUserId, fetchAllMessages, sendMessage, token } = useMessageStore();
    const [allUsers, setAllUsers] = useState([]);
    const [isActive, setIsActive] = useState(true);
    const bottomRef = useRef(null);
    const previousMessagesCount = useRef(messages.length);
    const intervalRef = useRef(null);

    // 📨 Charger les messages et les utilisateurs une seule fois au début
    useEffect(() => {
        if (token) {
            fetchAllMessages();
            fetchUsers();
        }
    }, [token]);

    // 🔁 Rafraîchir les messages seulement si l'onglet est actif et le token existe
    useEffect(() => {
        if (!token || !isActive) return;

        const startPolling = () => {
            if (intervalRef.current) clearInterval(intervalRef.current);

            intervalRef.current = setInterval(() => {
                if (document.visibilityState === 'visible' && isActive) {
                    fetchAllMessages();
                }
            }, 10000); // Réduit de 5s à 10s
        };

        startPolling();

        // Écouter la visibilité de l'onglet
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchAllMessages(); // Actualiser immédiatement au retour
                startPolling();
            } else {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [token, isActive, fetchAllMessages]);

    // 🔽 Scroll automatique si nouveaux messages
    useEffect(() => {
        const hasNewMessage = messages.length > previousMessagesCount.current;
        if (hasNewMessage) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            previousMessagesCount.current = messages.length;
        }
    }, [messages]);

    const fetchUsers = useCallback(async () => {
        if (!token || allUsers.length > 0) return; // Ne charge qu'une fois

        try {
            const res = await axios.get('https://www.krisscode.fr/affaire/connection', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAllUsers(res.data);
        } catch (err) {
            console.error('❌ Erreur chargement utilisateurs :', err);
        }
    }, [token, allUsers.length]);

    const handleSend = useCallback(async () => {
        if (!text.trim() || !token) return;

        try {
            await sendMessage(null, text);
            setText('');
            // Pas besoin de fetchAllMessages() car le polling s'en charge
        } catch (err) {
            console.error('❌ Erreur envoi message global :', err);
        }
    }, [text, token, sendMessage]);

    return (
        <div style={{
            maxWidth: '700px',
            margin: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            boxSizing: 'border-box'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>📨 Messagerie publique</h2>
                <button
                    onClick={() => setIsActive(!isActive)}
                    style={{
                        padding: '5px 10px',
                        backgroundColor: isActive ? '#28a745' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    {isActive ? '⏸️ Pause' : '▶️ Reprendre'}
                </button>
            </div>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '10px',
                backgroundColor: '#f5f5f5'
            }}>
                {messages.map((msg, i) => {
                    const isMine = msg.senderId === currentUserId;
                    return (
                        <div key={msg.id || i} style={{
                            display: 'flex',
                            justifyContent: isMine ? 'flex-end' : 'flex-start',
                            marginBottom: '10px'
                        }}>
                            <div style={{
                                maxWidth: '70%',
                                padding: '10px 15px',
                                borderRadius: '18px',
                                backgroundColor: isMine ? '#a2d2ff' : '#d9f99d',
                                color: '#000',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                {/* 👤 Nom de l'expéditeur (sauf si c'est toi) */}
                                {!isMine && (
                                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                        {msg.sender?.prenom} {msg.sender?.nom}
                                    </div>
                                )}
                                <div>{msg.content}</div>
                                <div style={{
                                    fontSize: '0.7em',
                                    color: '#555',
                                    textAlign: 'right',
                                    marginTop: '5px'
                                }}>
                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            <div style={{ display: 'flex', marginTop: '15px' }}>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Écris un message pour tout le monde..."
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid #ccc',
                        marginRight: '10px'
                    }}
                />
                <button
                    onClick={handleSend}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer'
                    }}
                >
                    Envoyer
                </button>
            </div>
        </div>
    );
}

export default MessageBox;
