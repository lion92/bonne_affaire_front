import { useEffect, useRef, useState } from 'react';
import { useMessageStore } from '../store/useMessageStore.js';
import axios from 'axios';

function MessageBox() {
    const [text, setText] = useState('');
    const { messages, currentUserId, fetchAllMessages, sendMessage, token } = useMessageStore();
    const [allUsers, setAllUsers] = useState([]);
    const bottomRef = useRef(null);
    const previousMessagesCount = useRef(messages.length);

    // 📨 Charger les messages et les utilisateurs une seule fois au début
    useEffect(() => {
        fetchAllMessages();
        fetchUsers();
    }, []);

    // 🔁 Rafraîchir les messages toutes les 5 secondes
    useEffect(() => {
        const interval = setInterval(() => {
            console.log('🔁 fetchAllMessages déclenché');
            fetchAllMessages();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // 🔽 Scroll automatique si nouveaux messages
    useEffect(() => {
        const hasNewMessage = messages.length > previousMessagesCount.current;
        if (hasNewMessage) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            previousMessagesCount.current = messages.length;
        }
    }, [messages]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:3004/connection', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAllUsers(res.data);
        } catch (err) {
            console.error('❌ Erreur chargement utilisateurs :', err);
        }
    };

    const handleSend = async () => {
        if (!text.trim()) return;
        try {
            await sendMessage(null, text); // ✅ Envoi global
            setText('');
            fetchAllMessages();
        } catch (err) {
            console.error('❌ Erreur envoi message global :', err);
        }
    };

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
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>📨 Messagerie publique</h2>

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
