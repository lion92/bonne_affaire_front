import React, { useEffect, useState } from 'react';
import { useUserProfileStore } from '../store/userProfilStore.js';
import '../css/profile.css';
import MessageBox from "./messageBox.jsx";

const UserProfile = () => {
    const token = localStorage.getItem('jwt');

    const {
        user,
        allUsers,
        allRoles,
        allPermissions,
        fetchProfile,
        fetchAllUsers,
        fetchAllRoles,
        fetchAllPermissions,
        updateRoles,
        createPermission,
        assignPermissionsToRole,
        error,
    } = useUserProfileStore();

    const [selectedRoles, setSelectedRoles] = useState({});
    const [selectedPermissions, setSelectedPermissions] = useState({});
    const [newPermission, setNewPermission] = useState('');

    const isAdmin = () => user?.roles?.some((role) => role.name === 'admin');

    useEffect(() => {
        if (token) {
            fetchProfile(token);
            fetchAllRoles(token);
            fetchAllPermissions(token);
        }
    }, [token]);

    useEffect(() => {
        if (user && isAdmin()) {
            fetchAllUsers(token);
        }
    }, [user]);

    useEffect(() => {
        const initialPermissions = {};
        allRoles.forEach((role) => {
            initialPermissions[role.id] = role.permissions.map(p => p.id);
        });
        setSelectedPermissions(initialPermissions);
    }, [allRoles]);

    const handleUpdateRoles = async (userId) => {
        if (token && selectedRoles[userId]) {
            await updateRoles(userId, selectedRoles[userId], token);
            alert(`Rôles mis à jour pour l'utilisateur ${userId}`);
            fetchAllUsers(token);
        }
    };

    const handleSelectRolesChange = (userId, roleIds) => {
        setSelectedRoles(prev => ({
            ...prev,
            [userId]: roleIds
        }));
    };

    const handlePermissionChange = (roleId, permissionIds) => {
        setSelectedPermissions(prev => ({
            ...prev,
            [roleId]: permissionIds
        }));
    };

    const handleAssignPermissions = async (roleId) => {
        if (!token || !selectedPermissions[roleId]) return;

        const role = allRoles.find(r => r.id === roleId);

        await assignPermissionsToRole(roleId, selectedPermissions[roleId], token);
        alert(`Permissions mises à jour pour le rôle ${role.name}`);
        fetchAllRoles(token);
    };


    const handleCreatePermission = async () => {
        if (newPermission.trim() && token) {
            await createPermission(newPermission, token);
            alert('Permission créée');
            setNewPermission('');
            fetchAllPermissions(token);
        }
    };

    if (!user) return <p>Chargement du profil...</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Mon Profil</h2>
            <p><strong>Nom :</strong> {user.prenom} {user.nom}</p>
            <p><strong>Email :</strong> {user.email}</p>

            <h3>Rôles attribués :</h3>
            <ul>
                {user.roles?.map((role) => (
                    <li key={role.id}>
                        {role.name}
                        <ul>
                            {role.permissions?.map((p) => (
                                <li key={p.id} style={{ fontSize: '0.9em', color: '#666' }}>→ {p.name}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            {isAdmin() && (
                <>
                    <hr/>
                    <h3>Gérer les utilisateurs</h3>
                    {allUsers?.filter(u => !u.roles?.some(r => r.name === 'admin')).map((u) => (
                        <div key={u.id} style={{marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc'}}>
                            <p><strong>{u.prenom} {u.nom}</strong> - {u.email}</p>
                            <select
                                multiple
                                value={selectedRoles[u.id] || u.roles.map(r => r.id)}
                                onChange={(e) =>
                                    handleSelectRolesChange(
                                        u.id,
                                        Array.from(e.target.selectedOptions, (opt) => +opt.value)
                                    )
                                }
                            >
                                {allRoles.map((role) => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                            <br/>
                            <button onClick={() => handleUpdateRoles(u.id)} style={{marginTop: '0.5rem'}}>
                                Enregistrer les rôles
                            </button>
                        </div>
                    ))}

                    <hr/>
                    <h3>Créer une permission</h3>
                    <input
                        type="text"
                        value={newPermission}
                        onChange={(e) => setNewPermission(e.target.value)}
                        placeholder="Nom de la permission"
                    />
                    <button onClick={handleCreatePermission} style={{marginLeft: '0.5rem'}}>
                        Ajouter
                    </button>

                    <hr/>
                    <h3>Attribuer des permissions aux rôles</h3>
                    {allRoles.map((role) => (
                        <div key={role.id} style={{ marginBottom: '1rem' }}>
                            <p><strong>{role.name}</strong></p>
                            <select
                                multiple
                                value={selectedPermissions[role.id] || []}
                                onChange={(e) =>
                                    handlePermissionChange(
                                        role.id,
                                        Array.from(e.target.selectedOptions, (opt) => +opt.value)
                                    )
                                }
                            >
                                {allPermissions.map((perm) => (
                                    <option key={perm.id} value={perm.id}>{perm.name}</option>
                                ))}
                            </select>
                            <br/>
                            <button onClick={() => handleAssignPermissions(role.id)} style={{ marginTop: '0.5rem' }}>
                                Ajouter les permissions
                            </button>
                        </div>
                    ))}
                </>
            )}
            <MessageBox></MessageBox>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default UserProfile;
